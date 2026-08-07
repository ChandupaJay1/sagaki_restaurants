<?php

namespace App\Auth;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

class HardcodedUserProvider implements UserProvider
{
    public const EMAIL = 'mgpdesaman@gmail.com';

    public const PASSWORD = '88222006';

    /**
     * Build the single, hardcoded application user.
     *
     * This intentionally bypasses the database so the application can be
     * locked down and demoed without a populated users table.
     */
    public static function user(): User
    {
        $user = new User();

        $user->id = 'admin';
        $user->name = 'MG_ Pathum';
        $user->email = self::EMAIL;
        $user->remember_token = 'hardcoded-remember-token';

        return $user;
    }

    /**
     * Verify the submitted credentials against the hardcoded login.
     */
    public static function check(string $email, string $password): bool
    {
        return hash_equals($email, self::EMAIL)
            && hash_equals($password, self::PASSWORD);
    }

    public function retrieveById($identifier): ?Authenticatable
    {
        return self::user();
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        return $identifier === 'admin' ? self::user() : null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void
    {
        //
    }

    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        return self::user();
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return self::check(
            (string) ($credentials['email'] ?? ''),
            (string) ($credentials['password'] ?? ''),
        );
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void
    {
        //
    }
}
