# Storage Management Scripts

This directory contains scripts for managing project images in Supabase storage.

## organize-storage.mjs

Organizes project images into dedicated folders in Supabase storage bucket.

### Features

- **Folder Organization**: Creates dedicated folders for each project (using project ID)
- **File Organization**: Moves loose images into their respective project folders
- **Database Updates**: Updates project records with new organized image URLs
- **Safety Features**: Dry-run mode, error handling, and detailed logging
- **Flexible Targeting**: Can target specific projects or process all projects

### Usage

#### Basic Commands

```bash
# Dry run (preview changes without making them)
npm run storage:organize:dry-run

# Actually organize the storage
npm run storage:organize

# Target a specific project
node scripts/organize-storage.mjs --project-id=<project-uuid>

# Dry run for specific project
node scripts/organize-storage.mjs --dry-run --project-id=<project-uuid>
```

#### Prerequisites

1. Ensure your `.env.local` file contains:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   # OR at minimum:
   SUPABASE_ANON_KEY=your_anon_key
   ```

2. Make sure the `project-images` storage bucket exists in Supabase

### How It Works

1. **Fetches Projects**: Retrieves all projects from the database with their current image URLs
2. **Analyzes Storage**: Lists all files in the `project-images` bucket
3. **Organizes Files**: For each project:
   - Skips already organized files (in project folders)
   - Skips temporary files (starting with `temp-`)
   - Moves loose files to dedicated project folders (`project-id/filename`)
   - Generates new organized URLs
4. **Updates Database**: Updates project records with new organized image URLs
5. **Reports Results**: Provides detailed summary of operations

### Folder Structure

After running the script, your storage will be organized like this:

```
project-images/
├── project-id-1/
│   ├── 1642435200000-abc123.jpg
│   ├── 1642435300000-def456.png
│   └── 1642435400000-ghi789.jpg
├── project-id-2/
│   ├── 1642435500000-jkl012.jpg
│   └── 1642435600000-mno345.png
└── temp-files/ (cleaned up eventually)
    ├── temp-1642435700000-pqr678.jpg
    └── temp-1642435800000-stu901.png
```

### Safety Features

- **Dry Run Mode**: Test the script without making changes
- **Error Handling**: Continues processing even if individual files fail
- **Fallback URLs**: Keeps original URLs if organization fails
- **Detailed Logging**: Shows exactly what the script is doing
- **Backup Strategy**: Never deletes original files, only moves them

### When to Use

- **Initial Setup**: When migrating from unorganized storage
- **Maintenance**: Periodically to organize any loose files
- **After Bulk Imports**: When images are uploaded outside the normal flow
- **Troubleshooting**: To fix storage organization issues

### Example Output

```
🚀 Storage Organization Script
===============================
🔍 DRY RUN MODE - No changes will be made

📋 Fetching projects...
✅ Found 5 projects

📁 Listing storage bucket contents...
✅ Found 23 files in storage

🔧 Processing project: "Modern Kitchen Remodel" (modern-kitchen-remodel)
   🖼️  Processing image 1/3
   ✅ Already organized: 1642435200000-abc123.jpg
   🖼️  Processing image 2/3
   🔍 Would move loose-file-1.jpg to: project-uuid-1/1642435300000-def456.jpg
   🖼️  Processing image 3/3
   🔍 Would move loose-file-2.png to: project-uuid-1/1642435400000-ghi789.png

📊 Summary
===========
Projects processed: 5
Images organized: 12
Errors encountered: 0

🔍 This was a dry run. To actually organize the files, run:
   node scripts/organize-storage.mjs
```

### Troubleshooting

#### Common Issues

1. **Permission Denied**: Make sure you're using a service role key, not just the anon key
2. **File Not Found**: Some images might have been deleted from storage but still referenced in DB
3. **Network Timeouts**: For large numbers of files, the script might need to be run in smaller batches

#### Recovery

If something goes wrong:
1. Check the console output for specific error messages
2. Use dry-run mode to see what would happen
3. Target specific projects with `--project-id` to fix issues incrementally
4. Original image URLs are preserved on errors, so projects should still work