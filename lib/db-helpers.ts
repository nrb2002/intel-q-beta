export async function safeMutation<T>(
  fn: () => Promise<T>,
  fallbackMessage = "Something went wrong. Please try again."
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    console.error("Mutation failed:", error);
    return { data: null, error: fallbackMessage };
  }
}