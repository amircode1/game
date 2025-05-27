import { Button, Card, CardBody, CardHeader, Checkbox, Input } from "@nextui-org/react";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <div className="flex justify-center items-center flex-col h-screen bg-gradient-to-r from-red-500 from-30% to-black to-50%">
      {/* کارت برای فرم ثبت نام */}
      <Card className="w-full max-w-lg lg:max-w-2xl flex justify-center items-center border-white border-1 p-6 lg:p-10">
        <CardHeader className="flex justify-center items-center mb-6">
          <h1 className="text-4xl lg:text-5xl text-white font-bold">Sign Up</h1>
        </CardHeader>

        <CardBody>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col gap-4 w-full">
              {/* فیلد نام */}
              <Input
                type="text"
                label="Name"
                fullWidth
                className="text-white"

              />
              {/* فیلد نام کاربری */}
              <Input
                type="text"
                label="Username"
                fullWidth
                className="text-white"

              />
              {/* فیلد ایمیل */}
              <Input
                type="email"
                label="Email"
                fullWidth
                className="text-white"

              />
              {/* فیلد رمز عبور */}
              <Input
                type="password"
                label="Password"
                fullWidth
                className="text-white"

              />
              {/* فیلد تکرار رمز عبور */}
              <Input
                type="password"
                label="Repeat Password"
                fullWidth
                className="text-white"

              />
              {/* گزینه تایید شرایط */}
              <Checkbox color="success" className="text-white">
                I agree to the Terms and Conditions
              </Checkbox>
              {/* دکمه ثبت نام */}
              <Button onPress={() => {}}
                type="submit"
                color="danger"
                variant="bordered"
                className="text-lg h-14 w-full mt-3"
              >
                Sign Up
              </Button>
            </div>
            
            {/* لینک ورود */}
            <Link to="/login" className="mt-5 text-white text-sm hover:underline">
              Already have an account? Login
            </Link>
          </form>
        </CardBody>

        {/* لینک بازگشت به خانه */}
        <Link to="/" className="text-white mt-6 text-sm hover:underline">
          Back to Home
        </Link>
      </Card>
    </div>
  );
}

export default SignUpPage;
