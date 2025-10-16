# Strapi CMS Integration Architecture

## Overview
This document details how the Next.js application integrates with Strapi v5 CMS for managing project media (images, brochures, etc.).

## Integration Architecture

```mermaid
graph TB
    subgraph "Browser"
        UserBrowser[User's Web Browser]
    end

    subgraph "Next.js Application"
        ProjectPage[Project Detail Page<br>/projects/slug]
        StrapiClient[Strapi Client<br>lib/strapi.ts]
        MediaProxy[Media Proxy API<br>/api/strapi-media/...]
    end

    subgraph "Strapi CMS - localhost:1337"
        StrapiAPI[REST API<br>/api/sale-properties]
        MediaLibrary[Media Library<br>/uploads/...]
        StrapiAuth[Authentication<br>Bearer Token]
    end

    subgraph "Environment"
        EnvVars[Environment Variables<br>STRAPI_URL<br>STRAPI_TOKEN]
    end

    UserBrowser -->|1. Request page| ProjectPage
    ProjectPage -->|2. Fetch project data| StrapiClient
    StrapiClient -->|3. GET with auth| StrapiAPI
    StrapiAPI -->|4. Return media URLs| StrapiClient
    StrapiClient -->|5. Convert to proxy URLs| ProjectPage
    ProjectPage -->|6. Render HTML| UserBrowser
    UserBrowser -->|7. Request media| MediaProxy
    MediaProxy -->|8. Fetch with auth| MediaLibrary
    MediaLibrary -->|9. Return media| MediaProxy
    MediaProxy -->|10. Cache & return| UserBrowser

    EnvVars -.->|Config| StrapiClient
    EnvVars -.->|Config| MediaProxy
    StrapiAuth -.->|Validate| StrapiAPI
    StrapiAuth -.->|Validate| MediaLibrary

    classDef browser fill:#61dafb,stroke:#333,stroke-width:2px
    classDef nextjs fill:#68a063,stroke:#333,stroke-width:2px,color:#fff
    classDef strapi fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    classDef env fill:#f39c12,stroke:#333,stroke-width:2px

    class UserBrowser browser
    class ProjectPage,StrapiClient,MediaProxy nextjs
    class StrapiAPI,MediaLibrary,StrapiAuth strapi
    class EnvVars env
```

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant Browser
    participant NextPage as Project Page
    participant StrapiLib as lib/strapi.ts
    participant ProxyAPI as /api/strapi-media
    participant Strapi as Strapi CMS

    Note over Browser,Strapi: Page Load - Fetch Project Data

    Browser->>NextPage: GET /projects/sunrise-residency
    NextPage->>NextPage: Query Prisma for project
    NextPage->>StrapiLib: getSalePropertyMediaByExternalId('sunrise-residency')
    
    StrapiLib->>Strapi: GET /api/sale-properties?filters[external_id][$eq]=sunrise-residency<br>populate[hero_image]=true<br>populate[property_images]=true<br>populate[brochure]=true<br>Authorization: Bearer TOKEN
    
    Strapi-->>StrapiLib: {<br>  hero_image: { url: '/uploads/hero.jpg' },<br>  brochure: { url: '/uploads/brochure.pdf' },<br>  property_images: [...]<br>}
    
    StrapiLib->>StrapiLib: absoluteUrl('/uploads/hero.jpg')<br>→ '/api/strapi-media/uploads/hero.jpg'
    
    StrapiLib-->>NextPage: {<br>  heroUrl: '/api/strapi-media/uploads/hero.jpg',<br>  brochureUrl: '/api/strapi-media/uploads/brochure.pdf',<br>  imageUrls: [...]<br>}
    
    NextPage-->>Browser: HTML with proxy URLs

    Note over Browser,Strapi: Media Loading - Fetch Images

    Browser->>ProxyAPI: GET /api/strapi-media/uploads/hero.jpg
    
    ProxyAPI->>Strapi: GET /uploads/hero.jpg<br>Authorization: Bearer TOKEN
    
    Strapi-->>ProxyAPI: Image binary data
    
    ProxyAPI-->>Browser: Image with headers:<br>Cache-Control: public, max-age=31536000, immutable
```

## Strapi Client Implementation

```mermaid
graph TB
    subgraph "lib/strapi.ts"
        GetMedia[getSalePropertyMediaByExternalId]
        StrapiFetch[strapiFetch]
        AbsoluteUrl[absoluteUrl]
        PickBestUrl[pickBestUrl]
    end

    subgraph "Functions"
        GetMedia -->|1. Build query| StrapiFetch
        StrapiFetch -->|2. Fetch from Strapi| StrapiAPI[Strapi API]
        StrapiAPI -->|3. Return data| GetMedia
        GetMedia -->|4. Extract media| PickBestUrl
        PickBestUrl -->|5. Get URL| AbsoluteUrl
        AbsoluteUrl -->|6. Convert to proxy URL| GetMedia
    end

    subgraph "URL Transformation"
        Original["/uploads/hero.jpg"]
        Proxy["/api/strapi-media/uploads/hero.jpg"]
        Original -->|absoluteUrl| Proxy
    end
```

## Media Proxy Implementation

```mermaid
graph TB
    subgraph "app/api/strapi-media/[...path]/route.ts"
        Request[Incoming Request<br>/api/strapi-media/uploads/hero.jpg]
        ExtractPath[Extract path array<br>['uploads', 'hero.jpg']]
        BuildURL[Build Strapi URL<br>http://localhost:1337/uploads/hero.jpg]
        AddAuth[Add Authorization header<br>Bearer TOKEN]
        FetchMedia[Fetch from Strapi]
        ReturnMedia[Return with cache headers]
    end

    Request --> ExtractPath
    ExtractPath --> BuildURL
    BuildURL --> AddAuth
    AddAuth --> FetchMedia
    FetchMedia --> ReturnMedia

    subgraph "Error Handling"
        CheckEnv[Check STRAPI_URL exists]
        CheckResponse[Check response.ok]
        HandleError[Return error response]
    end

    Request --> CheckEnv
    CheckEnv -->|Missing| HandleError
    FetchMedia --> CheckResponse
    CheckResponse -->|Failed| HandleError
```

## Strapi v5 Data Structure

```mermaid
graph TB
    subgraph "Strapi v5 Response Structure"
        Response[API Response]
        Data[data: Array]
        Entity[Entity Object]
        HeroImage[hero_image: Object]
        Brochure[brochure: Object]
        PropertyImages[property_images: Array]
    end

    Response --> Data
    Data --> Entity
    Entity --> HeroImage
    Entity --> Brochure
    Entity --> PropertyImages

    subgraph "Media Object Structure"
        MediaObj[Media Object]
        URL[url: string]
        Formats[formats: Object]
        Large[large: { url }]
        Medium[medium: { url }]
        Small[small: { url }]
        Thumbnail[thumbnail: { url }]
    end

    HeroImage --> MediaObj
    Brochure --> MediaObj
    MediaObj --> URL
    MediaObj --> Formats
    Formats --> Large
    Formats --> Medium
    Formats --> Small
    Formats --> Thumbnail

    Note1[Note: Strapi v5 returns media<br>directly on entity, not in<br>.data or .attributes wrapper]
```

## URL Conversion Strategy

```mermaid
graph LR
    subgraph "Strapi Returns"
        StrapiURL1["/uploads/hero_image.jpg"]
        StrapiURL2["http://cdn.example.com/image.jpg"]
    end

    subgraph "absoluteUrl Function"
        Check{Is absolute URL?}
        AddProxy[Add proxy prefix]
        KeepAbsolute[Keep as-is]
    end

    subgraph "Final URLs"
        ProxyURL["/api/strapi-media/uploads/hero_image.jpg"]
        AbsoluteURL["http://cdn.example.com/image.jpg"]
    end

    StrapiURL1 --> Check
    StrapiURL2 --> Check
    Check -->|No| AddProxy
    Check -->|Yes| KeepAbsolute
    AddProxy --> ProxyURL
    KeepAbsolute --> AbsoluteURL
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client as Next.js Server
    participant Strapi as Strapi CMS

    Note over Client,Strapi: Server-Side Authentication

    Client->>Client: Read STRAPI_TOKEN from env
    Client->>Strapi: GET /api/sale-properties<br>Authorization: Bearer {STRAPI_TOKEN}
    
    Strapi->>Strapi: Validate token
    
    alt Token Valid
        Strapi-->>Client: 200 OK + Data
    else Token Invalid
        Strapi-->>Client: 401 Unauthorized
    end

    Note over Client,Strapi: Media Proxy Authentication

    Client->>Client: Browser requests /api/strapi-media/uploads/file.jpg
    Client->>Strapi: GET /uploads/file.jpg<br>Authorization: Bearer {STRAPI_TOKEN}
    
    Strapi->>Strapi: Validate token
    
    alt Token Valid & File Exists
        Strapi-->>Client: 200 OK + File Binary
        Client-->>Client: Return to browser with cache headers
    else Token Invalid or File Not Found
        Strapi-->>Client: 401/404 Error
        Client-->>Client: Return error to browser
    end
```

## Environment Configuration

```mermaid
graph TB
    subgraph "Environment Variables"
        STRAPI_URL[STRAPI_URL<br>http://localhost:1337]
        STRAPI_TOKEN[STRAPI_TOKEN<br>API authentication token]
    end

    subgraph "Usage"
        StrapiClient[lib/strapi.ts<br>strapiFetch function]
        MediaProxy[app/api/strapi-media<br>Proxy route]
    end

    STRAPI_URL --> StrapiClient
    STRAPI_TOKEN --> StrapiClient
    STRAPI_URL --> MediaProxy
    STRAPI_TOKEN --> MediaProxy

    Note1[Note: These are server-side only<br>Never exposed to browser]
```

## Caching Strategy

```mermaid
graph TB
    subgraph "Cache Headers"
        CacheControl[Cache-Control:<br>public, max-age=31536000, immutable]
        ContentType[Content-Type:<br>From Strapi response]
    end

    subgraph "Browser Cache"
        FirstRequest[First Request]
        CachedRequest[Subsequent Requests]
    end

    subgraph "CDN/Edge Cache"
        EdgeCache[Vercel Edge Cache<br>Production only]
    end

    FirstRequest -->|Fetch from proxy| CacheControl
    CacheControl -->|Store in browser| CachedRequest
    CachedRequest -->|Serve from cache| Browser[Browser]
    
    FirstRequest -->|In production| EdgeCache
    EdgeCache -->|Cache at edge| CachedRequest
```

## Error Handling

```mermaid
graph TB
    subgraph "Error Scenarios"
        NoEnv[STRAPI_URL not configured]
        NoToken[STRAPI_TOKEN missing]
        NotFound[Media file not found]
        Unauthorized[Invalid token]
        NetworkError[Network error]
    end

    subgraph "Error Responses"
        Error500[500 Internal Server Error]
        Error404[404 Not Found]
        Error401[401 Unauthorized]
    end

    NoEnv --> Error500
    NetworkError --> Error500
    NotFound --> Error404
    Unauthorized --> Error401
    NoToken -->|Still attempts| Strapi[Strapi CMS]
    Strapi -->|May fail| Error401
```

## Benefits of Proxy Pattern

```mermaid
graph TB
    subgraph "Advantages"
        Security[Security<br>Token hidden from browser]
        CORS[No CORS Issues<br>Same-origin requests]
        Caching[Caching<br>Immutable cache headers]
        Flexibility[Flexibility<br>Can add transformations]
        Monitoring[Monitoring<br>Track media usage]
    end

    subgraph "Trade-offs"
        Latency[Additional Latency<br>Extra hop through Next.js]
        ServerLoad[Server Load<br>Proxy processes all media]
    end

    ProxyPattern[Media Proxy Pattern] --> Security
    ProxyPattern --> CORS
    ProxyPattern --> Caching
    ProxyPattern --> Flexibility
    ProxyPattern --> Monitoring
    
    ProxyPattern -.->|Cost| Latency
    ProxyPattern -.->|Cost| ServerLoad
```

## Strapi Collection Structure

```mermaid
graph TB
    subgraph "Strapi Content Type: sale-property"
        Collection[sale-property]
        Fields[Fields]
        
        PropertyID[property_id: String]
        Name[name: String]
        Type[type: String]
        ExternalID[external_id: String<br>Unique]
        
        HeroImage[hero_image: Media<br>Single]
        PropertyImages[property_images: Media<br>Multiple]
        Brochure[brochure: Media<br>Single]
    end

    Collection --> Fields
    Fields --> PropertyID
    Fields --> Name
    Fields --> Type
    Fields --> ExternalID
    Fields --> HeroImage
    Fields --> PropertyImages
    Fields --> Brochure

    subgraph "Matching Strategy"
        NextJSProject[Next.js Project<br>external_id field]
        StrapiProperty[Strapi sale-property<br>external_id field]
        Match[Match by external_id]
    end

    NextJSProject --> Match
    StrapiProperty --> Match
    Match --> HeroImage
    Match --> PropertyImages
    Match --> Brochure
```

## Future Enhancements

```mermaid
graph TB
    subgraph "Potential Improvements"
        ImageOptimization[Image Optimization<br>Resize, compress on-the-fly]
        CDNIntegration[CDN Integration<br>Cloudflare, CloudFront]
        LocalCache[Local File Cache<br>Reduce Strapi calls]
        WebP[WebP Conversion<br>Modern image formats]
        LazyLoading[Lazy Loading<br>Defer off-screen images]
    end

    CurrentProxy[Current Proxy Implementation] -.->|Enhance| ImageOptimization
    CurrentProxy -.->|Enhance| CDNIntegration
    CurrentProxy -.->|Enhance| LocalCache
    CurrentProxy -.->|Enhance| WebP
    CurrentProxy -.->|Enhance| LazyLoading
```

## Key Implementation Files

| File | Purpose |
|------|---------|
| `lib/strapi.ts` | Strapi client library with authentication |
| `app/api/strapi-media/[...path]/route.ts` | Media proxy API route |
| `app/projects/[slug]/page.tsx` | Project detail page consuming media |
| `.env` | Environment variables (STRAPI_URL, STRAPI_TOKEN) |

## Configuration Checklist

- [x] STRAPI_URL environment variable set
- [x] STRAPI_TOKEN environment variable set
- [x] Strapi CMS running on localhost:1337
- [x] sale-property collection created in Strapi
- [x] Media fields configured (hero_image, property_images, brochure)
- [x] Projects in database have matching external_id
- [x] Media files uploaded to Strapi
- [x] Proxy route handles authentication
- [x] URLs converted to proxy format
- [x] Cache headers configured

