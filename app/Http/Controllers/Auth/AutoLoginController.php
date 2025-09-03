<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AutoLoginController extends Controller
{
    /**
     * Handle auto-login from xoo admin panel
     */
    public function handleAutoLogin(Request $request)
    {
        try {
            $token = $request->query('token');            
            if (!$token) {
                Log::warning('Auto-login attempted without token');
                return redirect()->route('home')->with('error', 'Invalid login token');
            }

            // Decode and validate the token
            $payload = $this->decodeLoginToken($token);
            if (!$payload) {
                Log::warning('Auto-login failed - invalid token');
                return redirect()->route('home')->with('error', 'Invalid or expired login token');
            }

            // Find user by email (since both projects share the same database)
            $user = User::where('email', $payload['email'])->first();
            
            if (!$user) {
                Log::warning('Auto-login failed - user not found', ['email' => $payload['email']]);
                return redirect()->route('home')->with('error', 'User not found');
            }

            // Log the user in
            Auth::login($user);
            
            // Regenerate session for security
            $request->session()->regenerate();

            Log::info('Auto-login successful', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return redirect()->intended(route('admin.dashboard', absolute: false))
                ->with('success', 'Welcome to Loyalty System!');

        } catch (\Exception $e) {
            Log::error('Auto-login failed with exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('home')->with('error', 'Login failed. Please try again.');
        }
    }

    /**
     * Decode and validate login token from xoo
     */
    private function decodeLoginToken(string $token): ?array
    {
        try {
            Log::info('Attempting to decode token', [
                'token_length' => strlen($token),
                'token_preview' => substr($token, 0, 50) . '...'
            ]);

            // Decrypt the token
            $decryptedData = Crypt::decryptString($token);
            Log::info('Token decrypted successfully', [
                'decrypted_length' => strlen($decryptedData),
                'decrypted_preview' => substr($decryptedData, 0, 100) . '...'
            ]);

            $payload = json_decode($decryptedData, true);

            if (!$payload) {
                Log::warning('Invalid token format - JSON decode failed', [
                    'decrypted_data' => $decryptedData,
                    'json_error' => json_last_error_msg()
                ]);
                return null;
            }

            Log::info('Token payload decoded successfully', [
                'user_id' => $payload['user_id'] ?? 'N/A',
                'email' => $payload['email'] ?? 'N/A',
                'expires_at' => $payload['expires_at'] ?? 'N/A'
            ]);

            // Validate token structure
            $requiredFields = ['user_id', 'email', 'expires_at', 'issued_at', 'domain'];
            foreach ($requiredFields as $field) {
                if (!isset($payload[$field])) {
                    Log::warning('Invalid token - missing required field', ['field' => $field]);
                    return null;
                }
            }

            // Check if token is expired
            if (Carbon::now()->timestamp > $payload['expires_at']) {
                Log::warning('Token expired', [
                    'expires_at' => $payload['expires_at'],
                    'current_time' => Carbon::now()->timestamp
                ]);
                return null;
            }

            // Validate that token was issued recently (within 5 minutes)
            $tokenAge = Carbon::now()->timestamp - $payload['issued_at'];
            if ($tokenAge > 300) { // 5 minutes
                Log::warning('Token too old', [
                    'issued_at' => $payload['issued_at'],
                    'age_seconds' => $tokenAge
                ]);
                return null;
            }

            return $payload;
        } catch (\Exception $e) {
            Log::error('Failed to decode login token', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}
