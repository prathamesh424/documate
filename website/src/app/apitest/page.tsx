"use client"
import { useEffect, useState } from 'react';
import OpenAI from "openai"; 
const openai = new OpenAI({baseURL: "https://api.rhymes.ai/v1",dangerouslyAllowBrowser: true, apiKey:`${process.env.NEXT_PUBLIC_ARIA_API_KEY}`});

const ApiCallPage = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const callApi = async () => {
        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const response = await openai.chat.completions.create({
                model: "aria",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: "Write a haiku about recursion in programming.",
                    },
                ],
            });

            const data = await response;
            setResult(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        callApi();
    }, []);

    return (
        <div  className="bg-white" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>API Call Example</h1>
            {loading && <button disabled>Loading...</button>}
            {!loading && <button onClick={callApi}>Call API</button>}
            {loading && (
                <div className="loader"></div>
            )}
            {result && (
                <div>
                    <h2>Result:</h2>
                    <pre>{JSON.stringify(result)}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h2>Error:</h2>
                    <pre>{error}</pre>
                </div>
            )}

            <style jsx>{`
                .loader {
                    border: 8px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 8px solid #3498db;
                    width: 50px;
                    height: 50px;
                    animation: spin 2s linear infinite;
                    margin: 20px auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ApiCallPage;
