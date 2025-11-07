# Firestore Setup Guide

## Current Status
- ✅ Users collection exists
- ❌ Groups collection needs to be created
- ⚠️ Firebase Admin SDK needs service account key

## Step 1: Update Firestore Security Rules

1. Go to [Firebase Console - Firestore Rules](https://console.firebase.google.com/project/globemates-c35ba/firestore/rules)
2. Replace the current rules with the contents of `firestore.rules` file
3. Click **"Publish"**

This will:
- Allow authenticated users to read groups
- Allow users to read/write their own user data
- Allow group members to send messages and create posts

## Step 2: Get Service Account Key (Required for Backend)

The backend needs Firebase Admin SDK to create groups. Follow these steps:

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/globemates-c35ba/settings/serviceaccounts/adminsdk
   ```

2. **Click "Generate new private key"**

3. **Save the downloaded JSON file** as:
   ```
   backend/serviceAccountKey.json
   ```

4. **Restart the backend:**
   ```bash
   cd backend
   pnpm restart
   ```

## Step 3: Initialize Groups

Once the service account key is in place, the backend will be able to create groups:

1. **Start the backend** (if not running):
   ```bash
   cd backend
   pnpm dev
   ```

2. **Initialize groups via API:**
   ```bash
   curl -X POST http://localhost:3001/api/groups/initialize
   ```

   Or use the frontend: Click "Initialize Groups Now" on the Groups page.

## What Groups Will Be Created

The backend will create groups organized by:

1. **Program-Specific Groups** (e.g., "Paris Summer Program Group")
   - One for each combination of: City × Program Type
   - Program types: Study Abroad, Exchange Program, Summer Program, etc.

2. **City Groups** (e.g., "Paris City Group")
   - General location-based groups for each supported city

3. **First Program Groups** (e.g., "Paris First Program Group")
   - For students on their first study abroad experience

## Group Structure

Each group will have:
- `name`: Group name
- `description`: What the group is about
- `location`: City, Country (e.g., "Paris, France")
- `program`: Program type (if applicable)
- `category`: "Program Group", "Location-Based", or "Study Group"
- `memberIds`: Array of user IDs who joined
- `createdAt`: Timestamp

## Supported Cities

Groups will be created for:
- Tokyo, Japan
- Paris, France
- London, England
- New York City, USA
- Copenhagen, Denmark
- Milan, Italy
- Rome, Italy

## After Setup

Once groups are initialized:
- Users will see relevant groups based on their location and program
- Users can join groups matching their profile
- Joined groups will appear in "Your Groups" section
- Users can access group chats and posts

