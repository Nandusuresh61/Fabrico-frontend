import { googleAuthUser } from "../../redux/features/userSlice";
import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useGoogleLogin } from "@react-oauth/google";

import { useToast } from "../../hooks/use-toast";
function GoogleLogin() {
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();


    const responseGoogle = async (authResult) => {
        try {
          if(authResult.code){
            dispatch(googleAuthUser(authResult.code))
              .unwrap()
              .then(() => {
                toast({
                  title: "Logged In",
                  description: "Successfully logged in with Google!",
                  variant: "default",
                });
                navigate("/");
              })
              .catch((error) => {
                console.error("Google Auth Error: ", error);
                toast({
                  title: "Google Auth Error!",
                  description: typeof error === 'string' ? error : "Authentication failed",
                  variant: "destructive",
                });
              });
          }
        } catch (error) {
          console.log(error)
          toast({
            title: "Google Auth Error!",
            description: error.response?.data?.message || "Authentication failed",
            variant: "destructive",
          });
        }
      };
    
    
      const googleLogin = useGoogleLogin({
        onSuccess : responseGoogle,
        onError : (error) => {
          console.error("Google Login Error:", error);
          toast({
            title: "Google Login Error!",
            description: "Failed to connect to Google. Please try again.",
            variant: "destructive",
          });
        },
        flow : 'auth-code',
      })
    
    return (
        <>
            <div className="mt-6 grid grid-cols gap-3">
                <button
                    onClick={googleLogin}
                    type="button"
                    className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    <svg className="mr-2 h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    Google
                </button>
            </div>
        </>
    )
}

export default GoogleLogin