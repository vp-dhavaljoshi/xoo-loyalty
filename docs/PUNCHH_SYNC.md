# Punchh Sync Feature

This feature allows you to synchronize user reward points from the Punchh third-party service to your xoo-loyalty system.

## Overview

The Punchh Sync feature provides:

-   **One-click sync** for all users with Punchh tokens
-   **Individual user sync** for specific users
-   **Dry run mode** to preview changes before applying
-   **Background job processing** for large sync operations
-   **Real-time status monitoring** and statistics
-   **Error handling and logging** for failed syncs

## Setup

### 1. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# Punchh Service Configuration
PUNCHH_BASE_URI=https://api.us-west.punchh.com
PUNCHH_CLIENT_SECRET=your_client_secret_here
PUNCHH_CLIENT_KEY=your_client_key_here
PUNCHH_SERVICE=true
```

### 2. Database Migration

Run the migration to add the `punchh_token` field to the users table:

```bash
php artisan migrate
```

### 3. User Setup

Users need to have a `punchh_token` stored in their user record to be eligible for sync. This token should be obtained from the Punchh authentication process.

## API Endpoints

### Sync Operations

-   `POST /admin/api/punchh-sync/sync-all` - Sync all users
-   `POST /admin/api/punchh-sync/sync-user/{userId}` - Sync specific user

### Status and Monitoring

-   `GET /admin/api/punchh-sync/status` - Get sync status
-   `GET /admin/api/punchh-sync/test-connection` - Test Punchh connection
-   `GET /admin/api/punchh-sync/stats` - Get sync statistics
-   `GET /admin/api/punchh-sync/user/{userId}/history` - Get user sync history

### Request Parameters

#### Sync All Users

```json
{
    "dry_run": false,
    "user_id": null,
    "batch_size": 50
}
```

#### Sync Specific User

```json
{
    "dry_run": false
}
```

## Usage

### 1. Access the Sync Interface

Navigate to `/admin/punchh-sync` in your admin panel to access the sync interface.

### 2. Test Connection

Before syncing, test the Punchh connection to ensure the service is properly configured.

### 3. Dry Run

Use the "Dry Run" button to preview what changes would be made without actually applying them.

### 4. Sync All Users

Click "Sync All Users" to synchronize reward points for all users with Punchh tokens.

### 5. Monitor Results

View the sync results, statistics, and any errors in the interface.

## Background Jobs

For large sync operations, you can dispatch background jobs:

```php
use App\Jobs\PunchhSyncJob;

// Dispatch sync job
PunchhSyncJob::dispatch([
    'batch_size' => 50,
    'dry_run' => false
]);

// Dispatch sync job for specific user
PunchhSyncJob::dispatch([], $userId);
```

## Transaction Types

The sync feature creates transactions with the following types:

-   `punchh_sync_earned` - Points earned from Punchh system
-   `punchh_sync_adjustment` - Points adjusted to match Punchh system

## Error Handling

The sync feature includes comprehensive error handling:

-   **Connection errors** - When Punchh service is unreachable
-   **Authentication errors** - When user tokens are invalid
-   **Data validation errors** - When response data is malformed
-   **Database errors** - When transaction creation fails

All errors are logged and returned in the sync results.

## Monitoring and Logging

### Logs

Sync operations are logged in the Laravel log files with the following context:

-   User information
-   Sync parameters
-   Error details
-   Performance metrics

### Statistics

The sync feature tracks:

-   Total sync transactions
-   Points synchronized
-   Users synced
-   Error rates
-   Sync frequency

## Security Considerations

-   All API endpoints require authentication
-   User tokens are stored securely
-   Sync operations are logged for audit purposes
-   Dry run mode prevents accidental data changes

## Troubleshooting

### Common Issues

1. **"Punchh service is disabled"**

    - Check `PUNCHH_SERVICE` environment variable
    - Ensure all required environment variables are set

2. **"Connection test failed"**

    - Verify Punchh API credentials
    - Check network connectivity
    - Ensure Punchh service is running

3. **"User does not have Punchh token"**

    - User needs to authenticate with Punchh first
    - Check if `punchh_token` is stored in user record

4. **"Sync failed"**
    - Check Laravel logs for detailed error information
    - Verify user tokens are valid
    - Ensure database is accessible

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your `.env` file to get more detailed information about sync operations.

## Performance Considerations

-   Use batch processing for large user bases
-   Monitor memory usage during sync operations
-   Consider running syncs during off-peak hours
-   Use background jobs for non-blocking operations

## Support

For technical support or questions about the Punchh Sync feature, please refer to the application logs or contact your system administrator.

