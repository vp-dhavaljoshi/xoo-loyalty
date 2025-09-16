<?php

namespace App\Jobs;

use App\Repositories\Backend\PunchhSync\PunchhSyncRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PunchhSyncJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $options;
    protected ?int $userId;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     *
     * @param array $options
     * @param int|null $userId
     */
    public function __construct(array $options = [], ?int $userId = null)
    {
        $this->options = $options;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @param PunchhSyncRepository $punchhSyncRepository
     * @return void
     */
    public function handle(PunchhSyncRepository $punchhSyncRepository): void
    {
        try {
            Log::info('Starting Punchh sync job', [
                'options' => $this->options,
                'user_id' => $this->userId,
                'job_id' => $this->job->getJobId()
            ]);

            // Add user_id to options if provided
            if ($this->userId) {
                $this->options['user_id'] = $this->userId;
            }

            $result = $punchhSyncRepository->syncAllUsersRewardPoints($this->options);

            if ($result['status']) {
                Log::info('Punchh sync job completed successfully', [
                    'job_id' => $this->job->getJobId(),
                    'synced_users' => $result['data']['synced_users'] ?? 0,
                    'total_transactions' => $result['data']['total_transactions'] ?? 0,
                    'errors_count' => count($result['data']['errors'] ?? [])
                ]);
            } else {
                Log::error('Punchh sync job failed', [
                    'job_id' => $this->job->getJobId(),
                    'error' => $result['message'] ?? 'Unknown error'
                ]);

                // Fail the job if sync failed
                $this->fail(new \Exception($result['message'] ?? 'Sync failed'));
            }

        } catch (\Exception $exception) {
            Log::error('Punchh sync job exception', [
                'job_id' => $this->job->getJobId(),
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            // Re-throw the exception to mark the job as failed
            throw $exception;
        }
    }

    /**
     * Handle a job failure.
     *
     * @param \Throwable $exception
     * @return void
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Punchh sync job failed permanently', [
            'job_id' => $this->job->getJobId(),
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
            'options' => $this->options,
            'user_id' => $this->userId
        ]);
    }

    /**
     * Get the tags that should be assigned to the job.
     *
     * @return array
     */
    public function tags(): array
    {
        $tags = ['punchh-sync'];
        
        if ($this->userId) {
            $tags[] = 'user:' . $this->userId;
        }
        
        if (isset($this->options['dry_run']) && $this->options['dry_run']) {
            $tags[] = 'dry-run';
        }

        return $tags;
    }
}

