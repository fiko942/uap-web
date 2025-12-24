<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function promote(User $admin, User $target): bool
    {
        return $admin->isAdmin() && $target->role === 'customer';
    }

    public function ban(User $admin, User $target): bool
    {
        if (!$admin->isAdmin()) {
            return false;
        }

        // Cannot ban yourself
        if ($admin->id === $target->id) {
            return false;
        }

        // Cannot ban seed admin
        if ($target->isSuperAdmin()) {
            return false;
        }

        // Cannot ban inviter
        if ($target->id === $admin->created_by_admin_id) {
            return false;
        }

        return true;
    }

    public function unban(User $admin, User $target): bool
    {
        return $admin->isAdmin();
    }
}
