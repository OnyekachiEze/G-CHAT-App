// import { axiosInstance } from "./axios";

// export const signup = async (signupData) => {
//     const response = await axiosInstance.post("/auth/me", signupData);
//     return response.data
// }


export const getAuthUser = async () => { 
    async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data
    }
}