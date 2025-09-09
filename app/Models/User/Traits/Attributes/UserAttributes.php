<?php

namespace App\Models\User\Traits\Attributes;

trait UserAttributes
{
    /**
     * Get the user's full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the user's display name (first name + last initial)
     */
    public function getDisplayNameAttribute(): string
    {
        $lastInitial = !empty($this->last_name) ? substr($this->last_name, 0, 1) . '.' : '';
        return trim($this->first_name . ' ' . $lastInitial);
    }

    /**
     * Get the user's status as a readable string
     */
    public function getStatusTextAttribute(): string
    {
        return $this->status == 1 ? 'Active' : 'Inactive';
    }

    /**
     * Get the user's formatted phone number
     */
    public function getFormattedPhoneAttribute(): ?string
    {
        if (empty($this->phone)) {
            return null;
        }

        $countryCode = $this->country_code ?? '';
        return $countryCode ? "+{$countryCode} {$this->phone}" : $this->phone;
    }

    /**
     * Get the user's initials
     */
    public function getInitialsAttribute(): string
    {
        $firstInitial = !empty($this->first_name) ? strtoupper(substr($this->first_name, 0, 1)) : '';
        $lastInitial = !empty($this->last_name) ? strtoupper(substr($this->last_name, 0, 1)) : '';
        return $firstInitial . $lastInitial;
    }

    /**
     * Check if user is active
     */
    public function getIsActiveAttribute(): bool
    {
        return $this->status == 1;
    }

    /**
     * Check if user is inactive
     */
    public function getIsInactiveAttribute(): bool
    {
        return $this->status == 0;
    }

    /**
     * Get user's email verification status
     */
    public function getIsEmailVerifiedAttribute(): bool
    {
        return !is_null($this->email_verified_at);
    }

    /**
     * Get user's account age in days
     */
    public function getAccountAgeDaysAttribute(): int
    {
        return $this->created_at->diffInDays(now());
    }

    /**
     * Get user's account age in human readable format
     */
    public function getAccountAgeHumanAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }
}
