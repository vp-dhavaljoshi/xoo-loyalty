<?php

namespace App\Constants;

class AppConstants
{
    // HTTP Status Codes
    public const HTTP_OK = 200;
    public const HTTP_CREATED = 201;
    public const HTTP_BAD_REQUEST = 400;
    public const HTTP_UNAUTHORIZED = 401;
    public const HTTP_FORBIDDEN = 403;
    public const HTTP_NOT_FOUND = 404;
    public const HTTP_UNPROCESSABLE_ENTITY = 422;
    public const HTTP_INTERNAL_SERVER_ERROR = 500;

    // Response Status
    public const STATUS_SUCCESS = true;
    public const STATUS_ERROR = false;

    // User Status
    public const USER_STATUS_ACTIVE = 'Active';
    public const USER_STATUS_INACTIVE = 'Inactive';
    public const USER_STATUS_ALL = 'All';

    // Date Filters
    public const DATE_FILTER_ALL = 'All';
    public const DATE_FILTER_LAST_30_DAYS = 'Last 30 days';
    public const DATE_FILTER_LAST_90_DAYS = 'Last 90 days';
    public const DATE_FILTER_LAST_YEAR = 'Last year';
    public const DATE_FILTER_CUSTOM = 'Custom';

    // Sort Directions
    public const SORT_ASC = 'asc';
    public const SORT_DESC = 'desc';

    // Sort Fields
    public const SORT_FIELD_FIRST_NAME = 'first_name';
    public const SORT_FIELD_LAST_NAME = 'last_name';
    public const SORT_FIELD_EMAIL = 'email';
    public const SORT_FIELD_CREATED_AT = 'created_at';
    public const SORT_FIELD_STATUS = 'status';

    // Pagination
    public const DEFAULT_PAGE = 1;
    public const DEFAULT_PER_PAGE = 15;
    public const MAX_PER_PAGE = 100;
    public const MIN_PER_PAGE = 1;

    // Search
    public const MAX_SEARCH_LENGTH = 255;

    // CSV Export
    public const CSV_CONTENT_TYPE = 'text/csv';
    public const CSV_FILENAME_PREFIX = 'customers-';
    public const CSV_FILENAME_EXTENSION = '.csv';

    // Messages
    public const MESSAGE_VALIDATION_FAILED = 'Validation failed';
    public const MESSAGE_USERS_RETRIEVED_SUCCESS = 'Users retrieved successfully';
    public const MESSAGE_USER_RETRIEVED_SUCCESS = 'User retrieved successfully';
    public const MESSAGE_USER_NOT_FOUND = 'User not found';
    public const MESSAGE_USERS_RETRIEVED_FAILED = 'Failed to retrieve users';
    public const MESSAGE_USER_RETRIEVED_FAILED = 'Failed to retrieve user';
    public const MESSAGE_CSV_GENERATED_SUCCESS = 'CSV data generated successfully';
    public const MESSAGE_CSV_EXPORT_FAILED = 'Failed to export users';
    public const MESSAGE_SOMETHING_WENT_WRONG = 'Something went wrong';

    // Allowed Sort Fields
    public static function getAllowedSortFields(): array
    {
        return [
            self::SORT_FIELD_FIRST_NAME,
            self::SORT_FIELD_LAST_NAME,
            self::SORT_FIELD_EMAIL,
            self::SORT_FIELD_CREATED_AT,
            self::SORT_FIELD_STATUS,
        ];
    }

    // Allowed Sort Directions
    public static function getAllowedSortDirections(): array
    {
        return [
            self::SORT_ASC,
            self::SORT_DESC,
        ];
    }

    // Allowed Status Values
    public static function getAllowedStatusValues(): array
    {
        return [
            self::USER_STATUS_ALL,
            self::USER_STATUS_ACTIVE,
            self::USER_STATUS_INACTIVE,
        ];
    }

    // Allowed Date Filter Values
    public static function getAllowedDateFilterValues(): array
    {
        return [
            self::DATE_FILTER_ALL,
            self::DATE_FILTER_LAST_30_DAYS,
            self::DATE_FILTER_LAST_90_DAYS,
            self::DATE_FILTER_LAST_YEAR,
            self::DATE_FILTER_CUSTOM,
        ];
    }

    // Date Filter Days Mapping
    public static function getDateFilterDays(): array
    {
        return [
            self::DATE_FILTER_LAST_30_DAYS => 30,
            self::DATE_FILTER_LAST_90_DAYS => 90,
            self::DATE_FILTER_LAST_YEAR => 365,
        ];
    }
}
