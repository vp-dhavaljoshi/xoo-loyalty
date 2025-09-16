<?php

namespace App\Models\Backend\Rule\Traits\Attributes;

trait RuleAttributes
{
    /**
     * Get the rule's status as a readable string
     */
    public function getStatusTextAttribute(): string
    {
        return ucfirst($this->status);
    }

    /**
     * Get the rule's active status as boolean
     */
    public function getIsActiveAttribute(): bool
    {
        return $this->active;
    }

    /**
     * Get the rule's inactive status as boolean
     */
    public function getIsInactiveAttribute(): bool
    {
        return !$this->active;
    }

    /**
     * Get the rule's priority level as text
     */
    public function getPriorityLevelAttribute(): string
    {
        if ($this->priority >= 80) {
            return 'High';
        } elseif ($this->priority >= 50) {
            return 'Medium';
        } else {
            return 'Low';
        }
    }

    /**
     * Get the rule's type as a readable string
     */
    public function getTypeTextAttribute(): string
    {
        return ucfirst(str_replace('_', ' ', $this->type));
    }

    /**
     * Get formatted conditions as string
     */
    public function getFormattedConditionsAttribute(): string
    {
        if (empty($this->condition_objects)) {
            return $this->conditions;
        }

        return collect($this->condition_objects)->map(function ($condition, $index) {
            $prefix = $index > 0 && isset($condition['connector']) ? " {$condition['connector']} " : '';
            return $prefix . $condition['field'] . ' ' . $condition['operator'] . ' ' . $condition['value'];
        })->join('');
    }

    /**
     * Get the rule's lifetime status as text
     */
    public function getLifetimeStatusAttribute(): string
    {
        return $this->is_lifetime ? 'Lifetime' : 'Limited';
    }

    /**
     * Get the rule's cooldown period as human readable text
     */
    public function getCooldownTextAttribute(): ?string
    {
        if (!$this->cooldown_period) {
            return null;
        }

        if ($this->cooldown_period < 60) {
            return $this->cooldown_period . ' minutes';
        } elseif ($this->cooldown_period < 1440) {
            return round($this->cooldown_period / 60) . ' hours';
        } else {
            return round($this->cooldown_period / 1440) . ' days';
        }
    }

    /**
     * Get the rule's max applications text
     */
    public function getMaxApplicationsTextAttribute(): string
    {
        if (!$this->max_applications) {
            return 'Unlimited';
        }

        return $this->max_applications . ' times';
    }

    /**
     * Get the rule's points earned with multiplier
     */
    public function getEffectivePointsAttribute(): int
    {
        return $this->points_earned * $this->reward_multiplier;
    }

    /**
     * Get the rule's creation date in human readable format
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Get the rule's last update date in human readable format
     */
    public function getUpdatedAtHumanAttribute(): string
    {
        return $this->updated_at->diffForHumans();
    }

    /**
     * Check if rule is draft
     */
    public function getIsDraftAttribute(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if rule is published
     */
    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if rule is archived
     */
    public function getIsArchivedAttribute(): bool
    {
        return $this->status === 'archived';
    }

    /**
     * Get rule's condition count
     */
    public function getConditionCountAttribute(): int
    {
        return is_array($this->condition_objects) ? count($this->condition_objects) : 0;
    }

    /**
     * Get rule's display name (name with priority)
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name . ' (' . $this->priority_level . ')';
    }
}
