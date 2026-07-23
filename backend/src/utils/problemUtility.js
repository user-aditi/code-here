const axios = require('axios');

const getLanguageById = (lang)=>{
    const language = {
        "c++":54,
        "java":62,
        "javascript":63,
        "python": 71
    }
    return language[lang.toLowerCase()];
}

let currentJudge0KeyIndex = 0;
const getJudge0Keys = () => {
    if (process.env.JUDGE0_KEYS) {
        return process.env.JUDGE0_KEYS.split(',').map(k => k.trim());
    }
    return [process.env.JUDGE0_KEY].filter(Boolean);
};

const fetchWithJudge0KeyRotation = async (options) => {
    const keys = getJudge0Keys();
    if (keys.length === 0) throw new Error("No Judge0 keys available");

    for (let attempts = 0; attempts < keys.length; attempts++) {
        const key = keys[currentJudge0KeyIndex];
        options.headers['x-rapidapi-key'] = key;
        
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            const status = error?.response?.status;
            // 403 (Forbidden) or 429 (Too Many Requests) or 401 (Unauthorized) indicate exhaustion or invalid key
            if (status === 403 || status === 429 || status === 401) {
                console.warn(`[KeyRotation] Judge0 Key starting with ${key.substring(0, 5)}... failed (Status: ${status}). Rotating to next key.`);
                currentJudge0KeyIndex = (currentJudge0KeyIndex + 1) % keys.length;
            } else {
                console.error(error?.response?.data || error);
                throw error;
            }
        }
    }
    
    throw new Error("All Judge0 API keys have been exhausted or are invalid.");
};

const submitBatch = async (submissions)=>{
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
    };

    return await fetchWithJudge0KeyRotation(options);
}

const waiting = async(timer)=>{
  return new Promise(resolve => setTimeout(resolve, timer));
}

const submitToken = async(resultToken)=>{
    const options = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {
            tokens: resultToken.join(","),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    while(true){
        const result =  await fetchWithJudge0KeyRotation(options);
        const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

        if(IsResultObtained)
            return result.submissions;

        await waiting(1000);
    }
}

module.exports = {getLanguageById, submitBatch, submitToken};
