# Architecture Documentation

This document provides an overview of the application architecture, including database schema, API endpoints, and view components.

Generated on: 2025-12-05T06:48:25.173Z

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Views and Components](#views-and-components)
4. [Data Flow](#data-flow)

## Database Schema

### Tables

#### ContactSubmissions

- **ID**: contactsubmissions
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| name | VARCHAR | 255 | true | - | false | - |
| email | VARCHAR | 255 | true | - | false | - |
| subject | VARCHAR | 500 | false | - | false | - |
| message | TEXT | - | true | - | false | - |
| status | VARCHAR | 50 | false | - | false | - |
| created_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: true
- Get: true
- Update: true
- Delete: true

#### ChatSessions

- **ID**: 478c2978-88e9-48d4-bce8-0f98510cb75a
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| user1id | UUID | - | true | - | false | - |
| user2id | UUID | - | false | - | false | - |
| session_type | VARCHAR | 50 | true | - | false | - |
| status | VARCHAR | 50 | true | - | true | - |
| started_at | TIMESTAMP | - | true | - | false | - |
| ended_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: authenticated
- Get: authenticated
- Update: authenticated
- Delete: admin

#### UserPreferences

- **ID**: 365ecec4-2b32-4c07-9340-ea4608b25843
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| userid | UUID | - | true | foreign | false | - |
| preferred_chat_type | VARCHAR | 50 | false | - | false | - |
| interests | TEXT | - | false | - | true | - |
| language | VARCHAR | 50 | false | - | false | - |
| is_available | BOOLEAN | - | true | - | false | - |

**Authentication Requirements:**
- Add: authenticated
- Get: authenticated
- Update: authenticated
- Delete: authenticated

#### UserBans

- **ID**: 414b5ce0-207b-4906-83b7-8f40f7263f03
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| userid | UUID | - | true | foreign | false | - |
| reason | TEXT | - | true | - | true | - |
| banned_at | TIMESTAMP | - | true | - | false | - |
| expires_at | TIMESTAMP | - | false | - | false | - |
| is_permanent | BOOLEAN | - | true | - | false | - |
| banned_by | UUID | - | true | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: admin
- Update: admin
- Delete: admin

#### Reports

- **ID**: 16d1bd91-7dd1-43d1-9b43-4886b2804929
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| reporter_userid | UUID | - | true | - | false | - |
| reported_userid | UUID | - | true | - | false | - |
| chatsessionsid | UUID | - | false | foreign | false | - |
| reason | VARCHAR | 255 | true | - | true | - |
| description | TEXT | - | false | - | true | - |
| status | VARCHAR | 50 | true | - | true | - |
| created_at | TIMESTAMP | - | true | - | false | - |
| resolved_at | TIMESTAMP | - | false | - | false | - |

**Authentication Requirements:**
- Add: authenticated
- Get: admin
- Update: admin
- Delete: admin

#### SessionMetadata

- **ID**: cdd94958-28c5-4564-aaa7-4c0c9603c740
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| chatsessionsid | UUID | - | true | foreign | false | - |
| duration_seconds | INTEGER | - | false | - | false | - |
| user1_ip_hash | VARCHAR | 255 | false | - | false | - |
| user2_ip_hash | VARCHAR | 255 | false | - | false | - |
| user1_country | VARCHAR | 100 | false | - | true | - |
| user2_country | VARCHAR | 100 | false | - | true | - |
| ended_by | VARCHAR | 50 | false | - | false | - |
| created_at | TIMESTAMP | - | true | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: admin
- Update: admin
- Delete: admin

#### Advertisements

- **ID**: 1505ade3-792d-42e3-8a9e-98b8306c3532
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| title | VARCHAR | 255 | true | - | true | - |
| ad_type | VARCHAR | 50 | true | - | false | - |
| target_url | TEXT | - | true | - | false | - |
| placement | VARCHAR | 100 | true | - | false | - |
| is_active | BOOLEAN | - | true | - | false | - |
| starts_at | TIMESTAMP | - | false | - | false | - |
| ends_at | TIMESTAMP | - | false | - | false | - |
| impressions | INTEGER | - | false | - | false | - |
| clicks | INTEGER | - | false | - | false | - |
| created_at | TIMESTAMP | - | true | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: everyone
- Update: admin
- Delete: admin

#### AdvertisementImages

- **ID**: b2b41b18-5d52-4ef5-a5b3-88c7ecf159c8
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | System |
| advertisementsid | UUID | - | true | foreign | false | - |
| image_url | TEXT | - | true | - | false | Image |
| is_primary | BOOLEAN | - | true | - | false | - |
| display_order | INTEGER | - | false | - | false | - |
| caption | TEXT | - | false | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: everyone
- Update: admin
- Delete: admin

### Relationships

#### Reports Relationships

- **Reports.chatsessionsid** → **ChatSessions.id** (many-to-one)

#### SessionMetadata Relationships

- **SessionMetadata.chatsessionsid** → **ChatSessions.id** (many-to-one)

#### AdvertisementImages Relationships

- **AdvertisementImages.advertisementsid** → **Advertisements.id** (many-to-one)

## API Endpoints

### POST /api/ContactSubmit

- **ID**: contactsubmit
- **Authentication Required**: public
- **User Tier**: None

**Input Parameters (contactsubmit_input):**
*Input object for ContactSubmit API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| subject | string | No | - | - |
| message | string | Yes | - | - |

**Output Format (contactsubmit_output):**
*Output object for ContactSubmit API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |
| data | object | No | - | - |

**Implementation Notes:**
Create a POST endpoint that submits a contact form. Accept name, email, subject (optional), and message in the request body. Validate that name, email, and message are provided. Validate email format. Insert new record with status 'new'. Return success message with the created record data.

### GET /api/ContactList

- **ID**: contactlist
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactlist_input):**
*Input object for ContactList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| status | string | No | Filter by status: new, read, replied, archived | - |

**Output Format (contactlist_output):**
*Output object for ContactList API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| data | array<any> | Yes | - | - |
| total | number | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves all contact submissions. Support optional status filter query parameter. Return an array of all contact records including id, name, email, subject, message, status, and created_at. Sort by created_at in descending order (newest first). This is an admin-only endpoint.

### PUT /api/ContactUpdate

- **ID**: contactupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactupdate_input):**
*Input object for ContactUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| status | string | Yes | Status: new, read, replied, archived | - |

**Output Format (contactupdate_output):**
*Output object for ContactUpdate API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |
| data | object | No | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates a contact submission's status. Accept id and status in the request body. Validate that id is provided and status is one of: new, read, replied, archived. Update the record and return success message with the updated record data. This is an admin-only endpoint.

### DELETE /api/ContactDelete

- **ID**: contactdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactdelete_input):**
*Input object for ContactDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (contactdelete_output):**
*Output object for ContactDelete API*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Create a DELETE endpoint that deletes a contact submission. Accept id as a query parameter. Validate that id is provided and record exists. Delete the record and return success message. This is an admin-only endpoint.

### POST /api/findMatch

- **ID**: 32db90e6-affe-4ed4-a597-ba3ee24d1868
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (FindMatchInput):**
*Input object for findMatch*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| user_id | string | Yes | - | - |
| preferred_chat_type | string | No | - | - |
| interests | string | No | - | - |
| language | string | No | - | - |

**Output Format (FindMatchOutput):**
*Output object for findMatch*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| status | string | Yes | - | - |
| session_id | string | No | - | - |
| peer_id | string | No | - | - |

**Implementation Notes:**
Create a POST endpoint that initiates the matching process for an anonymous user. Accept optional user preferences (preferred_chat_type, interests, language) in the request body. First, check UserPreferences for available users (is_available = true) that match the preferences. If a match is found, create a new ChatSessions record with status 'pending', set both users' is_available to false in UserPreferences, and return the match details. If no match is found, mark the requesting user as available in UserPreferences (create or update) and return a waiting status. Return session_id if matched, or waiting status if queued.

### POST /api/cancelMatch

- **ID**: 9bb3a364-bf62-4c3d-ad8e-4c23bc268ff4
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (CancelMatchInput):**
*Input object for cancelMatch*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| user_id | string | Yes | - | - |
| session_id | string | No | - | - |

**Output Format (CancelMatchOutput):**
*Output object for cancelMatch*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that cancels a user's match search or ends an active session. Accept user_id and optional session_id in the request body. If session_id is provided, update the ChatSessions record to status 'ended' and set ended_at to current timestamp. Update the user's UserPreferences to set is_available to false. Return success confirmation.

### PUT /api/updateSessionStatus

- **ID**: 80cfcc6b-2f6e-4486-b7bc-eb5788cb33da
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (UpdateSessionStatusInput):**
*Input object for updateSessionStatus*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| session_id | string | Yes | - | - |
| status | string | Yes | - | - |
| ended_by | string | No | - | - |

**Output Format (UpdateSessionStatusOutput):**
*Output object for updateSessionStatus*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| session | object | Yes | - | - |

**Implementation Notes:**
Create a PUT endpoint that updates the status of a chat session. Accept session_id and status in the request body. Valid statuses are: pending, active, ended. If status is 'active', update started_at if not already set. If status is 'ended', update ended_at to current timestamp. Return the updated session data.

### POST /api/reportUser

- **ID**: aa7ba469-c403-43b6-95ed-5d7de2fbb168
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (ReportUserInput):**
*Input object for reportUser*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| reporter_userid | string | Yes | - | - |
| reported_userid | string | Yes | - | - |
| chatsessionsid | string | Yes | - | - |
| reason | string | Yes | - | - |
| description | string | No | - | - |

**Output Format (ReportUserOutput):**
*Output object for reportUser*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |
| report_id | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that allows a user to report another user for inappropriate behavior. Accept reporter_userid, reported_userid, chatsessionsid, reason, and description in the request body. Validate that reason is one of: harassment, inappropriate_content, spam, underage, other. Create a new Reports record with status 'pending' and created_at set to current timestamp. Return success confirmation with the report id.

### GET /api/checkUserBan

- **ID**: 26111634-e5e9-4725-b73a-1eb2a65745e9
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (CheckUserBanInput):**
*Input object for checkUserBan*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| userid | string | Yes | - | - |

**Output Format (CheckUserBanOutput):**
*Output object for checkUserBan*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| is_banned | boolean | Yes | - | - |
| reason | string | No | - | - |
| expires_at | string | No | - | - |
| is_permanent | boolean | No | - | - |

**Implementation Notes:**
Create a GET endpoint that checks if a user is currently banned. Accept userid as a query parameter. Query UserBans for active bans (is_permanent = true OR expires_at > current timestamp). Return ban status and details if banned, or allowed status if not banned.

### GET /api/getActiveAds

- **ID**: b0f244dc-c269-40f8-8efb-b2c6667a4ae4
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (GetActiveAdsInput):**
*Input object for getActiveAds*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| placement | string | No | - | - |

**Output Format (GetActiveAdsOutput):**
*Output object for getActiveAds*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| ads | array<any> | Yes | - | - |

**Implementation Notes:**
Create a GET endpoint that retrieves active advertisements for display. Accept optional placement query parameter to filter by ad placement location. Query Advertisements where is_active = true and current timestamp is between starts_at and ends_at. Join with AdvertisementImages to include image data. Return array of ads with their images sorted by display_order.

### POST /api/recordAdInteraction

- **ID**: bc23009a-6423-4c9c-8975-7167c061330f
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (RecordAdInteractionInput):**
*Input object for recordAdInteraction*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| advertisement_id | string | Yes | - | - |
| interaction_type | string | Yes | - | - |

**Output Format (RecordAdInteractionOutput):**
*Output object for recordAdInteraction*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that records an ad impression or click. Accept advertisement_id and interaction_type (impression or click) in the request body. Update the Advertisements record by incrementing either impressions or clicks count based on interaction_type. Return success confirmation.

### POST /api/saveSessionMetadata

- **ID**: a1c9783c-b458-4e87-9c3e-f3677d402389
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (SaveSessionMetadataInput):**
*Input object for saveSessionMetadata*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| chatsessionsid | string | Yes | - | - |
| duration_seconds | number | Yes | - | - |
| user1_ip_hash | string | No | - | - |
| user2_ip_hash | string | No | - | - |
| user1_country | string | No | - | - |
| user2_country | string | No | - | - |
| ended_by | string | No | - | - |

**Output Format (SaveSessionMetadataOutput):**
*Output object for saveSessionMetadata*

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| metadata_id | string | Yes | - | - |

**Implementation Notes:**
Create a POST endpoint that saves metadata about a completed chat session. Accept chatsessionsid, duration_seconds, user1_ip_hash, user2_ip_hash, user1_country, user2_country, and ended_by in the request body. Create a new SessionMetadata record with created_at set to current timestamp. Return success confirmation with the created metadata id.

## Views and Components

### Logos

#### Logo

- **ID**: c26190fb-0711-4f47-a2d9-a56e06ae34ed
- **Type**: logo

**Description:**
/logo.png

### Menus

#### Header Menu

- **ID**: 685c964f-d76c-42a2-89de-e14ffda6c53a
- **Type**: menu

**Description:**
26d5a4fb-eb01-43d7-aeef-0b6fc71dc528

#### Footer Menu

- **ID**: eb28a2c4-7f58-423d-b663-1d4cfb0ae9ec
- **Type**: menu

**Description:**
d9c8cc50-24f4-481c-91ef-de30b624ac1f

#### User Dashboard Menu

- **ID**: 26b3f0a9-b00a-4136-80da-68bc3c97ebca
- **Type**: menu

**Description:**
24188a76-51fe-48a9-ab5e-9d168436d71b

#### Admin Dashboard Menu

- **ID**: 1d78a36f-85e8-4914-a505-1e635895491c
- **Type**: menu

**Description:**
29ecf852-1c00-4760-8c29-8685abaf8546

### Login Buttons

#### Login Button

- **ID**: e3a6da17-13fe-4519-9aec-cb5240c14e00
- **Type**: loginbutton

### Containers

#### Header

- **ID**: 43740fe0-f46b-4fa3-b255-c5303fd7fcc0
- **Type**: container

**Description:**
[{"viewId":"c26190fb-0711-4f47-a2d9-a56e06ae34ed","colpos":2,"colposmd":10,"colpossm":8},{"viewId":"685c964f-d76c-42a2-89de-e14ffda6c53a","colpos":8,"colposmd":1,"colpossm":2},{"viewId":"317dced4-1c50-4d62-bca8-6d5e2d1b184a","colpos":1,"colposmd":0,"colpossm":0},{"viewId":"e3a6da17-13fe-4519-9aec-cb5240c14e00","colpos":1,"colposmd":1,"colpossm":2}]

### Icon Bars

#### Header Icon Bar

- **ID**: 317dced4-1c50-4d62-bca8-6d5e2d1b184a
- **Type**: iconbar

**Description:**
[]

### socialbar

#### Social Media Bar

- **ID**: 274976c0-9f23-4738-854d-c698551ca6d2
- **Type**: socialbar

**Description:**
{"bluesky":"","x":"","facebook":"","youtube":"","instagram":"","discord":"","tiktok":""}

### Text Sections

#### Copyright

- **ID**: 4d3d7e4f-ca11-4640-98c6-adb00e5e9bf6
- **Type**: text

**Description:**
© 2025 Nexus. All rights reserved.

#### Our Story

- **ID**: 66496aa6-8b1a-4cee-9387-dbdf4b21f1d2
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
  <div class="px-4 sm:px-6 md:px-8">
    <h1 class="mb-6 text-3xl font-bold">About Synapse</h1>
    <p class="text-xl mb-8">Where strangers become friends, one conversation at a time.</p>
    
    <div class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
      <p class="mb-6">In an increasingly connected yet isolated world, Synapse exists to bridge the gap between digital convenience and genuine human connection. Built by Nexus, we believe that meaningful conversations should happen spontaneously, without the barriers of social profiles, follower counts, or curated personas. Here, you are simply you, and the person you meet is simply them.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
      <div class="bg-white/10 border border-white/20 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Lightning-Fast Connections</h3>
        <p class="text-sm">Powered by cutting-edge WebRTC technology, Synapse establishes true peer-to-peer connections between users. Your video, audio, and text flow directly from you to your chat partner with minimal latency and maximum privacy.</p>
      </div>
      <div class="bg-white/10 border border-white/20 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-semibold text-lg mb-3">Privacy by Design</h3>
        <p class="text-sm">WebSocket technology handles our intelligent matching system while keeping your identity truly anonymous. No accounts required, no data stored, no digital footprint left behind.</p>
      </div>
    </div>

    <div class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Your Safety Matters</h2>
      <p class="mb-4">The Nexus team is deeply committed to creating a safe space for spontaneous conversation. Our platform includes robust moderation tools, an accessible Report Center for flagging inappropriate behavior, and a comprehensive Ban Management system that protects our community from bad actors.</p>
    </div>

    <div class="bg-white/10 border border-white/20 rounded-xl p-6">
      <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h3 class="font-semibold text-lg mb-3">Our Vision</h3>
      <p>We envision a global community where borders dissolve through conversation, where curiosity is rewarded with unexpected friendships, and where every click of the connect button holds the promise of discovering someone remarkable. Welcome to Synapse, your gateway to the world.</p>
    </div>
  </div>
</section>

#### Frequently Asked Questions

- **ID**: 3aad09ae-6ac4-478d-b488-7372829c1e61
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
<h1 class="px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h1>
<div class="px-4 sm:px-6 md:px-8">
<p class="mb-8 text-lg">Find answers to common questions about using Synapse, the anonymous chat platform by Nexus.</p>

<div class="space-y-6">

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">How does matching work?</h3>
<p class="text-sm">Our backend matching server instantly pairs available users using WebSocket connections. When you click connect, you enter a queue and are matched with another waiting user within seconds for real-time communication.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">Is my identity truly anonymous?</h3>
<p class="text-sm">Yes. Synapse never requires registration, email, or personal information. WebRTC peer-to-peer connections mean your media streams go directly to your chat partner without passing through our servers.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">What are the different chat types?</h3>
<p class="text-sm">Choose from video chat with full audio-visual streaming, audio-only for voice conversations, or text chat for typed messaging. All modes use low-latency WebRTC connections.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">How do I report inappropriate behavior?</h3>
<p class="text-sm">Use the report button during any session. Reports go directly to our Report Center where administrators review them promptly. You can also reach us through our Get in Touch page.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">Why was I banned and how can I appeal?</h3>
<p class="text-sm">Bans result from violating community guidelines. Submit appeals through our Ban Management system accessible via the Contact Form. Our admin team reviews each case individually.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">What technology keeps my connection secure?</h3>
<p class="text-sm">WebRTC provides encrypted peer-to-peer streaming with DTLS-SRTP encryption. WebSocket connections to our matching server use TLS. Your streams never touch our servers.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">Can I choose who I match with?</h3>
<p class="text-sm">Set preferences for interests or language before matching. Our system prioritizes compatible users, though availability affects match accuracy during peak times.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">How do I end a chat session?</h3>
<p class="text-sm">Click the disconnect button to instantly end your session and close the WebRTC connection. You can immediately search for a new match or exit Synapse entirely.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">Is Synapse free to use?</h3>
<p class="text-sm">Synapse by Nexus is completely free. No subscriptions, hidden fees, or premium tiers. Everyone gets the same fast, secure anonymous chat experience.</p>
</div>
</div>
</div>

<div class="bg-white/10 border border-white/20 rounded-xl p-6">
<div class="flex gap-4 items-start">
<svg class="w-8 h-8 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
<div>
<h3 class="font-semibold text-lg mb-2">What should I do if someone makes me uncomfortable?</h3>
<p class="text-sm">Disconnect immediately using the end chat button. Report the user through our Report Center, and our admin team will investigate. Your safety is our priority.</p>
</div>
</div>
</div>

</div>
</div>
</section>

#### Welcome to Nexus

- **ID**: 94cd3f47-b2a2-4bd8-83e8-01e66bc39b2b
- **Type**: text

**Description:**
<section class="w-full pt-12 sm:pt-16 pb-12 sm:pb-16">
  <div class="px-4 sm:px-6 md:px-8">
    <h1 class="mb-6 text-3xl font-bold">Welcome to Nexus</h1>
    <p class="text-xl mb-8 font-medium">Where strangers become stories. Where conversations spark without names.</p>
    <p class="mb-8 text-lg">Every click is a doorway to someone new. Nexus connects you instantly with real people from around the world through crystal-clear video, audio, and text chat—all without revealing who you are. Our peer-to-peer WebRTC technology means your conversations flow directly between you and your match, delivering the low-latency, high-quality streaming you deserve.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
      <div class="bg-white/10 border border-white/20 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        <h3 class="font-semibold text-lg mb-2">Privacy First</h3>
        <p class="text-sm">Your identity stays yours. Connect freely without compromise.</p>
      
      <div class="bg-white/10 border border-white/20 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        <h3 class="font-semibold text-lg mb-2">Instant Matching</h3>
        <p class="text-sm">Real-time WebSocket connections find your next conversation in seconds.</p>
      
      <div class="bg-white/10 border border-white/20 rounded-xl p-6">
        <svg class="w-10 h-10 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        <h3 class="font-semibold text-lg mb-2">Genuine Connection</h3>
        <p class="text-sm">No profiles. No pressure. Just authentic human moments.</p>
      
    
    <p class="font-semibold text-lg">Ready to meet someone new? The next conversation is one click away.</p>
  
</section>

#### Message Center Dashboard Link

- **ID**: c0765aef-cc0e-4b79-811f-822ae9e9a505
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': 'cff1b357-2149-4552-98e8-47173002b73c' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Ban Management Dashboard Link

- **ID**: 00a40892-e032-457a-b085-16a95231abcb
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': 'cff1b357-2149-4552-98e8-47173002b73c' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Report Center Dashboard Link

- **ID**: 1104eca7-57b7-4a04-99dc-1f8260ecf58e
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': 'cff1b357-2149-4552-98e8-47173002b73c' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Session Analytics Dashboard Link

- **ID**: a4add677-5685-495f-8993-55f962aea255
- **Type**: text

**Description:**
<a href="javascript:void(0)" onclick="window.postMessage({ 'navigate': 'cff1b357-2149-4552-98e8-47173002b73c' })" style="color: #6366f1; text-decoration: none; font-family: Inter; font-size: 0.875rem; transition: color 0.2s;">← Back to Admin Dashboard</a>

#### Terms of Service

- **ID**: 772b702c-7f8d-4e93-917e-c5bcfde743b9
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here.

#### Privacy Policy

- **ID**: 0454e734-6b13-4e2b-a6ff-19433d118a3e
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here.

### cta

#### Hero Content

- **ID**: 99fe5e06-8e6b-4288-8561-cbdaa4a1fcac
- **Type**: cta

**Description:**
{"headline":"Connect Instantly, Anonymously, Globally","subheader":"Break through barriers with seamless, private peer-to-peer communication that puts you in control","buttons":[{"buttonTitle":"Start Chatting","page":"2daabbce-26b5-46e0-8939-a9c34758de5f"}],"headlineStyle":{"fontFamily":"Outfit","color":"#ffffff","fontSize":"text-5xl md:text-7xl lg:text-8xl","fontWeight":"800"},"subheaderStyle":{"fontFamily":"Inter","color":"#e5e5e5","fontSize":"text-xl md:text-2xl"},"buttonStyle":{"fontFamily":"Outfit","color":"#ffffff","backgroundColor":"#6366f1","rounded":"rounded-full"}}

### Code Sections

#### Contact Form

- **ID**: ba766803-a846-4b2b-b3f1-1cbc016563bc
- **Type**: component
- **Consumes APIs**:
  - POST /api/ContactSubmit (Auth Required)

**Description:**
{"libraryComponent":"contact_form"}

#### Contact Submissions

- **ID**: 9e89db1e-2a22-412f-b1f7-554aaf66a895
- **Type**: component
- **Consumes APIs**:
  - GET /api/ContactList (Auth Required)
  - PUT /api/ContactUpdate (Auth Required)
  - DELETE /api/ContactDelete (Auth Required)

**Description:**
{"libraryComponent":"contact_admin"}

#### Dashboard Analytics

- **ID**: 1627194a-ecd5-4b8f-a204-b901f5f60e0d
- **Type**: component
- **Consumes APIs**:
  - POST /api/ContactSubmit (Auth Required)
  - POST /api/findMatch (Auth Required)
  - POST /api/cancelMatch (Auth Required)
  - PUT /api/updateSessionStatus (Auth Required)
  - POST /api/reportUser (Auth Required)
  - GET /api/checkUserBan (Auth Required)
  - GET /api/getActiveAds (Auth Required)
  - POST /api/recordAdInteraction (Auth Required)
  - POST /api/saveSessionMetadata (Auth Required)

#### Admin Dashboard Analytics

- **ID**: 4d43a734-df2d-4b3e-8f58-1bbeb5a8e990
- **Type**: component
- **Consumes APIs**:
  - POST /api/ContactSubmit (Auth Required)
  - GET /api/ContactList (Auth Required)
  - PUT /api/ContactUpdate (Auth Required)
  - DELETE /api/ContactDelete (Auth Required)
  - POST /api/findMatch (Auth Required)
  - POST /api/cancelMatch (Auth Required)
  - PUT /api/updateSessionStatus (Auth Required)
  - POST /api/reportUser (Auth Required)
  - GET /api/checkUserBan (Auth Required)
  - GET /api/getActiveAds (Auth Required)
  - POST /api/recordAdInteraction (Auth Required)
  - POST /api/saveSessionMetadata (Auth Required)

#### User Ban Checker

- **ID**: 4d1e304b-d306-4bb5-bd50-415904f415fb
- **Type**: component
- **Consumes APIs**:
  - GET /api/checkUserBan (Auth Required)

#### Reports Manager

- **ID**: 381e9be7-20db-4b67-80db-0802f4dbb775
- **Type**: component
- **Consumes APIs**:
  - POST /api/reportUser (Auth Required)

#### Session Metadata Tracker

- **ID**: 62fde52c-ba5e-4d3d-becd-8d3474c120db
- **Type**: component
- **Consumes APIs**:
  - POST /api/saveSessionMetadata (Auth Required)

### User Admin

#### UserAdminView

- **ID**: 0b016851-b93b-4da7-ac42-aaf237f17051
- **Type**: useradmin

### Login Components

#### LoginView

- **ID**: cc7e69bf-4c2c-4c48-b907-01c25cf1ac9c
- **Type**: login

## Data Flow

### API to View Mapping

- **POST /api/ContactSubmit** is used by:
  - Contact Form
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **GET /api/ContactList** is used by:
  - Contact Submissions
  - Admin Dashboard Analytics

- **PUT /api/ContactUpdate** is used by:
  - Contact Submissions
  - Admin Dashboard Analytics

- **DELETE /api/ContactDelete** is used by:
  - Contact Submissions
  - Admin Dashboard Analytics

- **POST /api/findMatch** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/cancelMatch** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **PUT /api/updateSessionStatus** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/reportUser** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Reports Manager

- **GET /api/checkUserBan** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - User Ban Checker

- **GET /api/getActiveAds** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/recordAdInteraction** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics

- **POST /api/saveSessionMetadata** is used by:
  - Dashboard Analytics
  - Admin Dashboard Analytics
  - Session Metadata Tracker

### Pages

| Page Name | Access Level | User Tier | Description |
|-----------|--------------|-----------|-------------|
| Home (Home) | public | all | Homepage |
| Get in Touch | everyone | free | Contact form page for visitors |
| Message Center | admin | free | Admin page for managing contact form submissions |
| Ban Management | admin | all | Check user ban status and manage account restrictions |
| Report Center | admin | all | Submit and review user reports for inappropriate behavior |
| Session Analytics | admin | all | Track and analyze chat session metadata and statistics |
| About Synapse | everyone | all | Learn about our mission to create meaningful anonymous connections |
| Help & FAQ | everyone | all | Frequently asked questions and helpful guides for using Synapse |
| Dashboard | registereduser | all | User dashboard page |
| Admin Dashboard | admin | all | Admin dashboard page |
| Login | everyone | all | User login page |
| Terms of Service | everyone | all | Legal terms and conditions for using the application |
| Privacy Policy | everyone | all | Details about how user data is collected and handled |
