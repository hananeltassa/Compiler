<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class CodeAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $apiKey = env('OPENAI_API_KEY');
        $openai = \OpenAI::client($apiKey);

        $messages = [
            ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ['role' => 'user', 'content' => 'Analyze the following code and provide suggestions: ' . $request->code],
        ];

        try {
            $response = $openai->chat()->create([
                'model' => 'gpt-3.5-turbo', 
                'messages' => $messages,
            ]);

            return response()->json([
                'analysis' => $response->choices[0]->message->content,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to analyze code: ' . $e->getMessage(),
            ], 500);
        }
    }
}