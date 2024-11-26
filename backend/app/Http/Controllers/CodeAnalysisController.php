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

        $openai = \OpenAI::client('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');

        $messages = [
            ['role' => 'system', 'content' => 'You are a helpful assistant.'],
            ['role' => 'user', 'content' => 'Analyze the following code and provide suggestions: ' . $request->code],
        ];

        $response = $openai->chat()->create([
            'model' => 'gpt-3.5-turbo-0125',
            'messages' => $messages,
        ]);

        return response()->json([
            'analysis' => $response->choices[0]->message->content, 
        ]);
    }
}
