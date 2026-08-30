import { tagTypes } from "../type/tagType";
import { baseApi } from "./_base/baseApi";
import { BACKEND_URL } from "@/constants/env";
import type { RootState } from "@/store/store";
import { File as ExpoFile, UploadType } from "expo-file-system";

export type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

const parseResponseBody = (body: string) => {
  if (!body) return null;

  try {
    return JSON.parse(body);
  } catch {
    return { message: body };
  }
};

const uploadFile = async (
  file: UploadFile,
  token?: string | null
): Promise<any> => {
  const localFile = new ExpoFile(file.uri);
  const result = await localFile.upload(`${BACKEND_URL}/upload/multiple`, {
    httpMethod: "POST",
    uploadType: UploadType.MULTIPART,
    fieldName: "files",
    mimeType: file.type,
    headers: token ? { Authorization: token } : undefined,
  });
  const responseData = parseResponseBody(result.body);

  if (result.status < 200 || result.status >= 300) {
    throw {
      status: result.status,
      data: responseData,
    };
  }

  return responseData;
};

const uploadFiles = async (
  files: UploadFile[],
  token?: string | null
): Promise<any> => {
  const responses = await Promise.all(
    files.map((file) => uploadFile(file, token))
  );

  if (responses.length === 1) return responses[0];

  return {
    success: responses.every((response) => response?.success !== false),
    data: responses.flatMap((response) =>
      Array.isArray(response?.data) ? response.data : []
    ),
  };
};

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMultiple: builder.mutation<any, UploadFile[]>({
      async queryFn(files, api) {
        try {
          const state = api.getState() as RootState;
          const data = await uploadFiles(files, state.auth.token);

          return { data };
        } catch (error: any) {
          return {
            error: error?.status
              ? error
              : {
                  status: "FETCH_ERROR",
                  error:
                    error?.message ||
                    "The device could not connect to the upload server.",
                },
          };
        }
      },
      invalidatesTags: [tagTypes.upload],
    }),
  }),
  overrideExisting: true,
});

export const { useUploadMultipleMutation } = uploadApi;
