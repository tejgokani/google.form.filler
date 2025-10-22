import axios from "axios";

/**
 * Submit a response to a Google Form
 */
export async function submitFormResponse(
  submitUrl: string,
  answers: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[FormSubmitter] Submitting to: ${submitUrl}`);
    console.log(`[FormSubmitter] Answers:`, JSON.stringify(answers, null, 2));

    // Convert answers to form data format
    const formData = new URLSearchParams();
    
    for (const [key, value] of Object.entries(answers)) {
      if (Array.isArray(value)) {
        // For checkboxes, add each value separately
        value.forEach(v => formData.append(key, String(v)));
      } else {
        formData.append(key, String(value));
      }
    }

    console.log(`[FormSubmitter] FormData string:`, formData.toString());

    // Submit to Google Forms
    const response = await axios.post(submitUrl, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      maxRedirects: 0,
      validateStatus: (status) => {
        // Google Forms returns 302/200 on success
        return status === 200 || status === 302;
      }
    });

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Check if it's actually a success (302 redirect)
      if (error.response?.status === 302) {
        return { success: true };
      }
      
      return {
        success: false,
        error: `Submission failed: ${error.message}`
      };
    }
    
    return {
      success: false,
      error: "Unknown error during submission"
    };
  }
}

/**
 * Submit multiple responses to a form
 */
export async function submitMultipleResponses(
  submitUrl: string,
  answersArray: Array<Record<string, any>>,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ success: boolean; error?: string }>> {
  const results: Array<{ success: boolean; error?: string }> = [];

  for (let i = 0; i < answersArray.length; i++) {
    const result = await submitFormResponse(submitUrl, answersArray[i]);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, answersArray.length);
    }

    // Small delay between submissions to avoid rate limiting
    if (i < answersArray.length - 1) {
      await delay(500);
    }
  }

  return results;
}

/**
 * Delay helper function
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
