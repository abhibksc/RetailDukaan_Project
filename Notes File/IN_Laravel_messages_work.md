Step 1 --> <!-- here we configure -->

i configure all the things in /home1/wipenyl6/retaildukan.wipenex.com/config/notifications.php like this

<?php


return [

    'Place Order' => [
        'sms' => [
            'template' => 'Retail Dukaan: Order #{{order_id}} placed. Delivery by {{delivery_date}}.',
            'auth_key' => 'PLACE_ORDER_AUTH_KEY',
            'sender_id' => 'RETDKN',
            'route_id' => 1,
        ],
        'email' => [
            'view' => 'emails.templates.place_order', // blade file
            'subject' => 'Your order has been placed!',
        ],
    ],

    'Shipped' => [
        'sms' => [
            'template' => 'Order #{{order_id}} has been shipped. Track here: {{tracking_url}}',
            'auth_key' => 'SHIPPED_AUTH_KEY',
            'sender_id' => 'RETSHIP',
            'route_id' => 2,
        ],
        'email' => [
            'view' => 'emails.templates.shipped',
            'subject' => 'Your order has shipped!',
        ],
    ],
];




<!-- *************************************************************** -->

Step 2 --> <!-- Create Templates  --> in  retaildukan.wipenex.com/resources/views




<!-- ********************************************************* -->

Step 2 --> <!-- NotificationService  --> in  /home1/wipenyl6/retaildukan.wipenex.com/app/Services/NotificationService.php


<?php


namespace App\Services;

use App\Jobs\SendNotificationJob;
use Illuminate\Support\Facades\Config;

class NotificationService
{
    public function send(string $templateType, array $payload): void
    {
        $config = config("notifications.$templateType");

        if (!$config) {
            \Log::error("Notification config not found for template: $templateType");
            return;
        }

        // Prepare SMS message
        if (!empty($config['sms'])) {
            $sms = $config['sms'];
            $message = $this->replacePlaceholders($sms['template'], $payload);

            SendNotificationJob::dispatch('sms', [
                'to' => $payload['user']->phone,
                'message' => $message,
                'auth_key' => $sms['auth_key'],
                'sender_id' => $sms['sender_id'],
                'route_id' => $sms['route_id'],
            ]);
        }

        // Prepare Email
        if (!empty($config['email'])) {
            $email = $config['email'];

            SendNotificationJob::dispatch('email', [
                'to' => $payload['user']->email,
                'subject' => $email['subject'],
                'view' => $email['view'],
                'data' => $payload,
            ]);
        }
    }

   private function replacePlaceholders(string $template, array $data): string
{
    foreach ($data as $key => $value) {
        if (is_object($value)) {
            foreach (get_object_vars($value) as $subKey => $subValue) {
                $template = str_replace("{{{$key}.{$subKey}}}", $subValue, $template);
            }
        } else {
            $template = str_replace("{{{$key}}}", $value, $template);
        }
    }
    return $template;
}

}


<!-- ******************************************************************************* -->

Step 3 --> <!-- SendNotificationJob  --> in  /home1/wipenyl6/retaildukan.wipenex.com/app/Jobs/SendNotificationJob.php //asyn work in queue

<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $type;
    protected $payload;

    public function __construct($type, array $payload)
    {
        $this->type = $type;
        $this->payload = $payload;
    }

    public function handle()
    {
        if ($this->type === 'sms') {
            Http::get("http://msg.wipenex.in/rest/services/sendSMS/sendGroupSms", [
                'AUTH_KEY' => $this->payload['auth_key'],
                'message' => $this->payload['message'],
                'senderId' => $this->payload['sender_id'],
                'routeId' => $this->payload['route_id'],
                'mobileNos' => $this->payload['to'],
                'smsContentType' => 'english',
            ]);
        }

        if ($this->type === 'email') {
            Mail::send($this->payload['view'], $this->payload['data'], function ($msg) {
                $msg->to($this->payload['to'])
                    ->subject($this->payload['subject']);
            });
        }
    }
}



<!-- ******************************************************************************* -->

Step 4 --> <!-- OrderService  --> in  /home1/wipenyl6/retaildukan.wipenex.com/app/Services/OrderService.php //asyn work in queue


finally and do alway like this.. 



 protected $notificationService;
     public function __construct(
        NotificationService $notificationService,
    ) {
        $this->notificationService = $notificationService;
    }


      $this->notificationService->send(
                 'Place Order',
                 [
                     'order_id' => $unOrderId,
                     'delivery_date' => $deliverySchedule,
                     'user' => Auth::user(),
                 ]
             );




             //it handle email and phone both.
             




