<?php

namespace App\Services\Punchh;

use App\Constants\AppConstants;
use Carbon\Carbon;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

/**
 * PunchhService for xoo-loyalty
 * Handles communication with Punchh third-party service
 */
class PunchhService
{
    public string $host;
    public string $clientId;
    public string $secret;
    public bool $service;

    /**
     * __construct()
     */
    public function __construct()
    {
        $this->host = config('services.punchh.base_uri');
        $this->clientId = config('services.punchh.client_key');
        $this->secret = config('services.punchh.client_secret');
        $this->service = config('services.punchh.service');
    }

    /**
     * Get user reward points from Punchh
     *
     * @param string $punchhToken
     * @return array
     * @throws GuzzleException
     */
    public function getUserRewardPoints(string $punchhToken): array
    {
        if (!$punchhToken) {
            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Invalid authentication token'
            ];
        }

        $body = ['authentication_token' => $punchhToken];
        
        return $this->sendRequest('GET', '/api/auth/checkins/balance', $body, $punchhToken);
    }

    /**
     * Get user transaction history from Punchh
     *
     * @param string $punchhToken
     * @param int $page
     * @param int $perPage
     * @return array
     * @throws GuzzleException
     */
    public function getUserTransactionHistory(string $punchhToken, int $page = 1, int $perPage = 50): array
    {
        if (!$punchhToken) {
            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Invalid authentication token'
            ];
        }

        $body = [
            'authentication_token' => $punchhToken,
            'page' => $page,
            'per_page' => $perPage
        ];
        
        return $this->sendRequest('GET', '/api/auth/checkins/history', $body, $punchhToken);
    }

    /**
     * Get user profile information from Punchh
     *
     * @param string $punchhToken
     * @return array
     * @throws GuzzleException
     */
    public function getUserProfile(string $punchhToken): array
    {
        if (!$punchhToken) {
            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Invalid authentication token'
            ];
        }

        $body = ['authentication_token' => $punchhToken];
        
        return $this->sendRequest('GET', '/api/auth/users/profile', $body, $punchhToken);
    }

    /**
     * Send request to Punchh API
     *
     * @param string $method
     * @param string $urlPath
     * @param array $body
     * @param string $authToken
     * @return array
     * @throws GuzzleException
     */
    public function sendRequest(string $method, string $urlPath, array $body, string $authToken = ""): array
    {
        if (!$this->service) {
            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Punchh service is disabled'
            ];
        }

        $body['client'] = $this->clientId;
        $body['authentication_token'] = $authToken;
        $body = json_encode($body);

        $xPchDigest = $this->generateSignature($urlPath, $body);
        $responseData = [];

        try {
            $headers = [
                'Content-Type' => 'application/json',
                'x-pch-digest' => $xPchDigest,
                'x-pch-client-id' => $this->clientId,
            ];

            if ($authToken) {
                $headers['Authorization'] = 'Bearer ' . $authToken;
            }

            $client = new Client();
            $response = $client->request($method, $this->host . $urlPath, [
                'headers' => $headers,
                'body' => $body,
            ]);

            $responseData['status'] = AppConstants::STATUS_SUCCESS;
            $responseData['data'] = json_decode($response->getBody()->getContents(), true);

        } catch (RequestException $e) {
            Log::error('Punchh API request failed', [
                'method' => $method,
                'url' => $this->host . $urlPath,
                'error' => $e->getMessage(),
                'response_code' => $e->getResponse() ? $e->getResponse()->getStatusCode() : null,
                'response_body' => $e->getResponse() ? $e->getResponse()->getBody()->getContents() : null
            ]);

            $responseData['status'] = AppConstants::STATUS_ERROR;
            $responseData['error'] = $e->getResponse()
                ? $e->getResponse()->getStatusCode() . ' - ' . $e->getResponse()->getBody()->getContents()
                : $e->getMessage();
        } catch (Exception $e) {
            Log::error('Punchh API unexpected error', [
                'method' => $method,
                'url' => $this->host . $urlPath,
                'error' => $e->getMessage()
            ]);

            $responseData['status'] = AppConstants::STATUS_ERROR;
            $responseData['error'] = 'An unexpected error occurred: ' . $e->getMessage();
        }

        return $responseData;
    }

    /**
     * Generate signature for Punchh API
     *
     * @param string $urlPath
     * @param string $body
     * @return string
     */
    public function generateSignature(string $urlPath, string $body): string
    {
        return hash_hmac('sha1', $urlPath . $body, $this->secret);
    }

    /**
     * Validate Punchh service configuration
     *
     * @return bool
     */
    public function isConfigured(): bool
    {
        return !empty($this->host) && 
               !empty($this->clientId) && 
               !empty($this->secret) && 
               $this->service;
    }

    /**
     * Test connection to Punchh API
     *
     * @return array
     */
    public function testConnection(): array
    {
        if (!$this->isConfigured()) {
            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Punchh service is not properly configured'
            ];
        }

        try {
            $body = ['client' => $this->clientId];
            $response = $this->sendRequest('GET', '/api/health', $body);
            
            return [
                'status' => $response['status'],
                'message' => $response['status'] ? 'Connection successful' : 'Connection failed',
                'data' => $response['data'] ?? null
            ];
        } catch (Exception $e) {
            Log::error('Punchh connection test failed', [
                'error' => $e->getMessage()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'error' => 'Connection test failed: ' . $e->getMessage()
            ];
        }
    }
}

