import { NextResponse } from "next/server";
import { youtube, youtube_v3 } from "@googleapis/youtube";
import { getCachedStream, setCachedStream } from "@/lib/streamCache";

// Custom error interface for GaxiosError and fs errors
interface CustomError extends Error {
  code?: number | string;
  response?: { data?: unknown };
  errors?: unknown;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const title = searchParams.get("title");

  if (!movieId || !title) {
    return NextResponse.json(
      { error: "Missing movieId or title" },
      { status: 400 }
    );
  }

  const parsedMovieId = Number(movieId);
  if (isNaN(parsedMovieId)) {
    return NextResponse.json({ error: "Invalid movieId" }, { status: 400 });
  }

  try {
    // Check cache first
    let streamUrl = await getCachedStream(parsedMovieId);
    if (streamUrl) {
      console.log(`Cache hit for movie ${parsedMovieId}: ${streamUrl}`);
      return NextResponse.json({ streamUrl });
    }

    // Validate API key
    const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      console.error("YouTube API key is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Search YouTube
    const yt = youtube({ version: "v3", auth: youtubeApiKey });
    const response = await yt.search.list({
      part: ["snippet"],
      q: `${title} free full movie`,
      type: ["video"],
      maxResults: 1,
      videoEmbeddable: "true",
      videoSyndicated: "true",
    });

    // Validate response
    const data: youtube_v3.Schema$SearchListResponse = response.data;
    if (!data) {
      console.error("YouTube API response missing data");
      return NextResponse.json(
        { error: "Failed to search YouTube" },
        { status: 500 }
      );
    }

    const videoId = data.items?.[0]?.id?.videoId;
    streamUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;

    // Cache result
    if (streamUrl) {
      await setCachedStream(parsedMovieId, streamUrl);
    }
    console.log(
      `YouTube search for "${title}" (ID ${parsedMovieId}): ${streamUrl}`
    );

    return NextResponse.json({ streamUrl });
  } catch (error: unknown) {
    // Type guard for error properties
    let message = "Unknown error";
    let code: number | string | undefined;
    let details: unknown;

    if (error instanceof Error) {
      message = error.message;
      if ("code" in error) {
        code = (error as CustomError).code; // Safe type assertion
      }
      if ("response" in error) {
        details = (error as CustomError).response?.data; // Safe type assertion
      } else if ("errors" in error) {
        details = (error as CustomError).errors; // Safe type assertion
      }
    }

    console.error("YouTube API Error:", { message, code, details });
    return NextResponse.json(
      { error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
}
