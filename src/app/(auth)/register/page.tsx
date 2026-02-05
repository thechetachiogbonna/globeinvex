"use client";

import AlertModel from "@/components/AlertModel";
import { useAuthContext } from "@/context/AuthContext";
import { registerUser } from "@/lib/actions/user.actions";
import { generateUniqueUsername } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function Register() {
  const [isAllFieldRequired, setIsAllFieldRequired] = useState(false)
  const [passwordDontMatch, setPasswordDontMatch] = useState(false)
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false)

  const searchParams = useSearchParams()

  const { setUser } = useAuthContext()

  const router = useRouter()

  useEffect(() => {
    if (registeredSuccessfully) {
      setTimeout(() => {
        setRegisteredSuccessfully(false)
        router.push("/user/dashboard")
      }, 1500)
    }

    if (searchParams.get("ref")) {
      const form = document.querySelector("form")!
      const formData = new FormData(form)
      formData.append("referralId", "chetachi")
    }
  }, [registeredSuccessfully])

  const onSubmitRegister = async (e: FormEvent) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget as HTMLFormElement)
    const firstName = form.get("firstName") as string
    const lastName = form.get("lastName") as string
    const email = form.get("email") as string
    const referralId = form.get("referralId") as string
    const password = form.get("password") as string
    const confirmPassword = form.get("confirmPassword") as string

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setIsAllFieldRequired(true)
    } 

    if (password !== confirmPassword) {
      return setPasswordDontMatch(true)
    }

    const name = `${firstName} ${lastName}`
    const username = generateUniqueUsername(firstName)

    console.log({
      name,
      username,
      email,
      password,
      confirmPassword,
      referralId
    })
    try {
      const newUser = await registerUser({
        email,
        password,
        name,
        username,
        referralId
      })

      setUser(newUser)

      setRegisteredSuccessfully(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="w-full max-w-md bg-white rounded-md shadow-md">
        <div className="p-[90px]">
          <Image 
            src="/images/GlobalInvestB.png" 
            alt="Global Invest Logo" 
            width={250}
            height={0}
            className="w-[250px] h-auto mx-auto" 
          />
        </div>

        <div className="relative border-b pb-4 flex flex-col-reverse md:flex-row justify-start md:justify-between items-start md:items-center mb-8">
          <div className="absolute -bottom-1 rounded-[2px] left-16 w-8 h-2 bg-green" />
          <h2 className="text-2xl font-semibold text-green px-6 w-[80%] mx-auto">Signup Form</h2>
        </div>

        <form className="p-6 w-[80%] mx-auto space-y-4" onSubmit={onSubmitRegister}>
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Enter your first name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Enter your last name"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="referralId" className="text-sm font-medium text-gray-700">
              Referral ID
            </label>
            <input
              type="text"
              id="referralId"
              name="referralId"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Enter your referral ID"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-green placeholder:text-sm"
              placeholder="Re-enter your password"
            />
          </div>
          <div className="flex flex-row justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-1 bg-green text-sm text-white font-medium rounded-md"
            >
              Register
            </button>
            <Link href="/login" className="mt-4 sm:mt-0 text-sm text-green hover:underline">
              Log me in?
            </Link>
          </div>
        </form>
      </div>

      {passwordDontMatch && (
        <AlertModel 
          icon="error"
          title="Password don't match"
          desc="Please make sure your password match"
          alt="Error icon"
          continueButtonAction={() => setPasswordDontMatch(false)}
        />
      )}

      {isAllFieldRequired && (
        <AlertModel 
          icon="error"
          title="All field required"
          desc="Please make sure all field are filled"
          alt="Error icon"
          continueButtonAction={() => setIsAllFieldRequired(false)}
        />
      )}

      {registeredSuccessfully && (
        <AlertModel 
          icon="success"
          title="Registered successfully"
          desc="You have successfully registered"
          alt="Success icon"
          continueButtonAction={() => {
            setRegisteredSuccessfully(false)
            router.push("user/dashboard")
          }}
        />
      )}
    </>
  )
}

export default Register;