# Backend Setup Guide

The application requires a Supabase backend to function correctly. Follow these steps to set it up.

## Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and sign in.
2. Click **New Project**.
3. Enter a name (e.g., `SkillSwap AI`) and a secure database password.
4. Choose a region close to your users.
5. Click **Create new project**.

## Step 2: Get Credentials
1. Once the project is created, go to **Project Settings** (gear icon) -> **API**.
2. Find the **Project URL** and **anon public key**.

## Step 3: Configure Environment Variables
1. Open the `.env` file in the project root.
2. Update the following variables with your credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Step 4: Setup Database Schema
1. In your Supabase Dashboard, go to the **SQL Editor** (icon with `>_`).
2. Click **New Query**.
3. Open the file `supabase_schema.sql` from this project.
4. Copy the entire content and paste it into the SQL Editor.
5. Click **Run**.

## Step 5: Verify
1. Restart your development server:
   ```bash
   npm run dev
   ```
2. Try to Register or Login. It should now work correctly.

> [!NOTE]
> If you see "fetch failed" errors, ensure your internet connection is active and the Supabase project is not paused.
