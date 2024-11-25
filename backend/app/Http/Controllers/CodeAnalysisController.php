<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CodeAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $openai = \OpenAI::client('');

        $prompt = "Analyze the following code and provide suggestions:\n\n" . $request->code;

        $response = $openai->completions()->create([
            'model' => 'text-davinci-003',
            'prompt' => $prompt,
            'max_tokens' => 100,
        ]);

        return response()->json([
            'analysis' => $response->choices[0]->text,
        ]);
    }
}
