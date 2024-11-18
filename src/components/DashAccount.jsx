"use client";
import React, { useState, useEffect, useRef } from 'react'
import styles from './dashboard.module.css';
import { Image } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DecodeTokenEmail from '@/utils/DecodeTokenEmail';
import FetchUserDetails from '@/utils/FetchUserDetails';
import { useRouter } from 'next/navigation';

const DashAccount = () => {
    const router = useRouter()
    const [userDetails, setUserDetails] = useState({
        firstname:"",
        lastname:"",
        email:"",
        apikey:"",
    });
    const [image, setImage] = useState(null);
    const [token, setToken] = useState(null);
    const [success, setSuccess] = useState(false)
    const[name , setname] = useState('')
    const[email , setemail] = useState('')
    const[apikey , setapikey] = useState('')

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        console.log("this is success value", success)
        if (success) {
            window.location.reload();
        }
    }, [success])

    // ==================social login=============================
    const { data: session, status } = useSession();

    // Log the entire session object
    console.log("Full session data:", session);
  
    // Log specific session properties
    useEffect(() => {
        const handleSessionOrToken = async () => {
            if (session?.user) {
                // Handle session logic
                console.log("User email:", session.user?.email);
                console.log("User name:", session.user?.name);
                console.log("User image:", session.user?.image);
                console.log("Session expires:", session.expires);

                setUserDetails({
                    firstname: session.user.name,
                    email: session.user.email,
                    image: session.user.image,
                });

                console.log("Setting user details from session:", session.user);
            } else {
                // Handle token logic
                const token = localStorage.getItem("token");

                if (token) {
                    try {
                        const email = DecodeTokenEmail(token); // Replace with your decoding logic
                        const fetchedUserDetails = await FetchUserDetails(email); // Replace with your API call
                        setUserDetails(fetchedUserDetails[0]); // Store the fetched details in state
                        console.log("Setting user details from token:", fetchedUserDetails[0]);
                    } catch (error) {
                        console.error("Failed to handle token logic:", error);
                    }
                } else {
                    console.warn("No session or token found.");
                }
            }
        };

        handleSessionOrToken();
    }, [session]);



    const handleUpload = async (file) => {
        if (!file) {
            alert("Please select an image to upload.");
            return;
        }


        const formData = new FormData();
        formData.append('file', file);
        if (token) {

            // Manually decode the token to get the email
            const email = DecodeTokenEmail(token);
            formData.append('email', email);
        }


        try {


            const response = await fetch('/api/userDp', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const result = await response.json();
            console.log('Image uploaded successfully:', result);
            // Optionally update UI or save result.path in database
            // window.location.reload();
            setSuccess(true)

            // closeModal();


        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle the file (e.g., upload it or display a preview)
            setImage(file); // Set the selected file to state
            console.log('Selected file:', file);
            handleUpload(file); // Automatically trigger upload

        }
    };


    const handleEditProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            console.log('Attempting to update profile for userId:', userId);
            console.log('Update payload:', { userId, name, email, apikey });

            const response = await fetch('/api/users/editprofile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    name: userDetails?.firstname,
                    email: userDetails?.email,
                    apikey:userDetails?.apikey,
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                console.error('Response not OK:', response.status, response.statusText);
                throw new Error('Failed to update profile');
            }

            const result = await response.json();
            console.log('Update result:', result);

            if (result.success) {
                setSuccess(true);
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message);
        }
    };

 





    const handleRemoveProfilePicture = async () => {
        if (!token) {
            alert("User is not authenticated.");
            return;
        }

        const email = DecodeTokenEmail(token);
        try {
            const response = await fetch('/api/removeDp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove image');
            }

            const result = await response.json();
            console.log('Image removed successfully:', result);
            setImage(null); // Clear the local state if needed
            // closeModal();
            setSuccess(true)

        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    const handleUploadClick = () => {
        // Trigger the file input click
        fileInputRef.current.click();
    };

    const fetchPlan = () => {
        const plan_id = localStorage.getItem("plan_id");
        switch (plan_id) {
            case -1:
                return `Plan Expired`;
                
            case 1:
                return `Starter (Monthly)`;

            case 2:
                return `Enterprise (Monthly)`;

            case 3:
                return `Starter (Yearly)`;

            case 4:
                return `Enterprise (Yearly)`;
        
            default:
                return `Free Plan`
        }
    }

    return (
        <div className={styles.turnitApiDetectorheadingbg}>
            <div className={styles.turnitApiDetectorheading}>
                <Image src="/images/accountt.svg" alt="Open Menu" fluid />

                <p>Account</p>
            </div>
            {/* 1 */}
            <div className={styles.turnitApiDetectorBgAccount}>
                <div className={styles.turnitApiDetectorContent}>
                    <div className={styles.tadcProfileImgEditProfile}>
                        <div className={styles.tadcProfileImg}>
                            <div className={styles.tadcProfileImgset}>
                                {/* <Image className={styles.tadcProfileImgsetwidth} src="/images/changepic.png" alt="profile" fluid /> */}
                                {userDetails && userDetails.image ? (
                                    <Image className={styles.tadcProfileImgsetwidth}
                                        src={userDetails.image}
                                        alt="profile"
                                        fluid
                                    />) : (

                                    <Image className={styles.tadcProfileImgsetwidth}
                                        src="/images/changepic.png"
                                        alt="profile"
                                        fluid
                                    />
                                )}

                                <Dialog>
                                    <DialogTrigger asChild>
                                        {/* <Button variant="outline">Edit Profile</Button> */}
                                        <button><Image src="/images/tapedit.svg" alt="profile" fluid /></button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Edit Image</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your profile Image here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">

                                            <div className="items-center flex justify-center">
                                                {userDetails && userDetails.image ? (
                                                    <Image className={styles.tadcProfileImgsetwidth}
                                                        src={userDetails.image}
                                                        alt="Turnit Logo"
                                                        width={96}
                                                        height={96}
                                                    />) : (

                                                    <Image className={styles.tadcProfileImgsetwidth}
                                                        src="/images/changepic.png"
                                                        alt="Turnit Logo"
                                                        fluid
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            {/* <Button type="submit">Upload</Button> */}
                                            {/* <form onSubmit={handleUpload}>
                                                <label className={styles.turnitDpEditUpload}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                        <g clipPath="url(#clip0_346_11587)">
                                                            <path d="M6.78449 7.93825C7.46747 7.93825 8.02113 7.38458 8.02113 6.70161C8.02113 6.01863 7.46747 5.46497 6.78449 5.46497C6.10151 5.46497 5.54785 6.01863 5.54785 6.70161C5.54785 7.38458 6.10151 7.93825 6.78449 7.93825Z" fill="#F8F8F8" />
                                                            <path d="M16.9351 11.2531C16.3511 10.7035 15.6126 10.3428 14.8053 10.2398V3.95349C14.8053 3.28365 14.5305 2.6825 14.1011 2.23594C13.6546 1.78937 13.0534 1.53174 12.3836 1.53174H2.42176C1.75191 1.53174 1.15076 1.80655 0.704198 2.23594C0.257634 2.6825 0 3.28365 0 3.95349V11.8714V12.61V14.2073C0 14.8772 0.274809 15.4783 0.704198 15.9249C1.15076 16.3714 1.75191 16.6291 2.42176 16.6291H12.0573C12.6927 17.1443 13.4828 17.4707 14.3588 17.4707C15.3721 17.4707 16.2824 17.0585 16.9351 16.4058C17.5878 15.7531 18 14.8428 18 13.8294C18 12.8161 17.5878 11.9058 16.9351 11.2531ZM0.910305 3.95349C0.910305 3.54128 1.08206 3.16342 1.35687 2.90578C1.63168 2.63097 2.00954 2.45922 2.42176 2.45922H12.3836C12.7958 2.45922 13.1737 2.63097 13.4485 2.90578C13.7233 3.18059 13.895 3.55846 13.895 3.97067V9.32945L11.3531 6.78746C11.1813 6.61571 10.8893 6.59853 10.7004 6.78746L6.87023 10.6348L4.27672 8.0241C4.10496 7.85235 3.81298 7.83517 3.62405 8.0241L0.910305 10.7722V3.95349ZM2.40458 15.7531V15.7188C1.99237 15.7188 1.6145 15.547 1.33969 15.2722C1.08206 14.9974 0.910305 14.6195 0.910305 14.2073V12.61V12.0775L3.95038 9.02029L6.54389 11.6138C6.71565 11.7856 7.00763 11.7856 7.19656 11.6138L11.0267 7.76647L13.5344 10.2913C13.4828 10.3085 13.4313 10.3256 13.3798 10.3428C13.3111 10.36 13.2424 10.3772 13.1565 10.4115C13.0878 10.4287 13.0191 10.463 12.9504 10.4802C12.8989 10.4974 12.8645 10.5146 12.813 10.5489C12.7443 10.5833 12.6927 10.6004 12.6412 10.6348C12.5553 10.6863 12.4695 10.7378 12.3836 10.7894C12.3321 10.8237 12.2977 10.8409 12.2462 10.8752C12.2118 10.8924 12.1947 10.9096 12.1603 10.9268C12.0057 11.0298 11.8683 11.1501 11.7481 11.2875C11.0954 11.9401 10.6832 12.8504 10.6832 13.8638C10.6832 14.1214 10.7176 14.3619 10.7691 14.6195C10.7863 14.6882 10.8034 14.7398 10.8206 14.8085C10.8721 14.9802 10.9237 15.152 10.9924 15.3237V15.3409C11.0611 15.4783 11.1298 15.6329 11.2156 15.7531H2.40458ZM16.2653 15.7531C15.7672 16.2512 15.0973 16.5432 14.3416 16.5432C13.6202 16.5432 12.9504 16.2512 12.4695 15.7875C12.4008 15.7188 12.3321 15.6329 12.2634 15.5642C12.2118 15.5127 12.1603 15.444 12.1088 15.3924C12.0401 15.3065 11.9885 15.2035 11.937 15.1004C11.9027 15.0317 11.8683 14.9802 11.834 14.9115C11.7996 14.8256 11.7653 14.7226 11.7481 14.6195C11.7309 14.5508 11.6966 14.4649 11.6794 14.3962C11.645 14.2245 11.6279 14.0356 11.6279 13.8466C11.6279 13.0909 11.937 12.4211 12.4179 11.923C12.8989 11.4249 13.5859 11.1329 14.3416 11.1329C15.0973 11.1329 15.7672 11.442 16.2653 11.923C16.7634 12.4211 17.0553 13.0909 17.0553 13.8466C17.0553 14.5852 16.7462 15.255 16.2653 15.7531Z" fill="#F8F8F8" />
                                                            <path d="M14.6682 11.9913C14.6338 11.9569 14.5823 11.9226 14.5136 11.8882C14.462 11.8711 14.4105 11.8539 14.359 11.8539C14.3418 11.8539 14.3418 11.8539 14.3418 11.8539C14.3246 11.8539 14.3246 11.8539 14.3246 11.8539C14.2731 11.8539 14.2216 11.8711 14.1701 11.8882C14.1185 11.9054 14.067 11.9398 14.0155 11.9913L12.9506 13.0562C12.7788 13.2279 12.7788 13.5199 12.9506 13.7088C13.1223 13.8806 13.4143 13.8806 13.6033 13.7088L13.8781 13.434V15.3233C13.8781 15.581 14.0842 15.7871 14.3418 15.7871C14.5994 15.7871 14.8056 15.581 14.8056 15.3233V13.434L15.0804 13.7088C15.2521 13.8806 15.5441 13.8806 15.733 13.7088C15.9048 13.5371 15.9048 13.2451 15.733 13.0562L14.6682 11.9913Z" fill="#F8F8F8" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_346_11587">
                                                                <rect width="18" height="18" fill="white" transform="translate(0 0.500977)" />
                                                            </clipPath>
                                                        </defs>

                                                       
                                                    </svg>
                                                    Upload
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        ref={fileInputRef}
                                                        className={styles.fileInput}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>

                                               
                                                <button type="submit" style={{ display: 'none' }}></button>
                                            </form> */}
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                {/* Hidden file input */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                />

                                                {/* Upload button to trigger file input */}
                                                <Button type="button" onClick={handleUploadClick}>
                                                    Upload
                                                </Button>
                                            </form>
                                            <Button className="mb-4 mb-lg-0" type="submit" onClick={handleRemoveProfilePicture}>Remove</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <h4>Profile</h4>


                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                {/* <Button variant="outline">Edit Profile</Button> */}
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_346_13990)"><path d="M22.1511 15.0771C21.8209 15.0771 21.5533 15.3447 21.5533 15.6748V20.9819C21.5522 21.9719 20.7501 22.7742 19.7602 22.7751H2.98862C1.99864 22.7742 1.19662 21.9719 1.19545 20.9819V5.40586C1.19662 4.41611 1.99864 3.61385 2.98862 3.61268H8.29576C8.62591 3.61268 8.89348 3.34511 8.89348 3.01496C8.89348 2.68504 8.62591 2.41724 8.29576 2.41724H2.98862C1.33881 2.4191 0.00186789 3.75605 0 5.40586V20.9822C0.00186789 22.632 1.33881 23.9689 2.98862 23.9708H19.7602C21.41 23.9689 22.7469 22.632 22.7488 20.9822V15.6748C22.7488 15.3447 22.4812 15.0771 22.1511 15.0771Z" fill="#FFF"></path><path d="M22.5121 0.878905C21.4616 -0.171549 19.7586 -0.171549 18.7081 0.878905L8.04433 11.5427C7.97124 11.6158 7.91848 11.7064 7.89093 11.8058L6.48861 16.8685C6.43094 17.0761 6.48954 17.2983 6.64178 17.4508C6.79424 17.603 7.01652 17.6616 7.22409 17.6042L12.2868 16.2017C12.3862 16.1741 12.4768 16.1213 12.5499 16.0483L23.2134 5.38425C24.2623 4.3331 24.2623 2.63145 23.2134 1.5803L22.5121 0.878905ZM9.34671 11.9312L18.0742 3.20349L20.8889 6.01817L12.1612 14.7459L9.34671 11.9312ZM8.78448 13.0594L11.0332 15.3083L7.92268 16.1701L8.78448 13.0594ZM22.3682 4.53903L21.7343 5.17295L18.9194 2.35804L19.5536 1.72412C20.137 1.14064 21.0831 1.14064 21.6666 1.72412L22.3682 2.42552C22.9508 3.0097 22.9508 3.95508 22.3682 4.53903Z" fill="#FFF"></path></g><defs><clipPath id="clip0_346_13990"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                                </button>
                            </DialogTrigger>

                            {/* ============edit profile ========= */}
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleEditProfile}>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="firstname" className="text-right">
                                            First Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter Name"
                                            value={userDetails?.firstname}
                                            onChange={(e) => setUserDetails({
                                                ...userDetails,
                                                firstname: e.target.value
                                            })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="lastname" className="text-right">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter Name"
                                            value={userDetails?.lastname}
                                            onChange={(e) => setUserDetails({
                                                ...userDetails,
                                                lastname: e.target.value
                                            })}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="username" className="text-right">
                                            Email
                                        </Label>
                                        <Input
                                            type="email"
                                            id="username"
                                            placeholder="Enter Email"
                                            value={userDetails?.email}
                                            onChange={(e) => setUserDetails({
                                                ...userDetails,
                                                email: e.target.value
                                            })}
                                            // defaultValue="@peduarte"
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right"  id="apikey">
                                            API Key
                                        </Label>
                                        <Input
                                            id="apikey"
                                            placeholder="Enter API Key"
                                            value={userDetails?.apikey}
                                            onChange={(e) => setUserDetails({
                                                ...userDetails,
                                                apikey: e.target.value
                                            })}
                                            // defaultValue="Pedro Duarte"
                                            className="col-span-3"
                                        />
                                    </div>

                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                                </form>
                            </DialogContent>

                            {/* =========edit form end======= */}
                        </Dialog>
                    </div>


                    <p>Your profile information</p>
                </div>
                <div className={styles.turnitApiDetectorKey}>
                    {/* 1 */}
                    <div className={styles.tApiDetectorKey}>
                        <h5>Name</h5>
                        <div className={styles.tApiDetectorKeyeditbtn}>
                            {/* <p>Name</p> */}
                            <p>{userDetails ? `${userDetails.firstname}  ${userDetails.lastname || ''}` : 'Name not available'}</p>
                            {/* <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_346_13990)"><path d="M22.1511 15.0771C21.8209 15.0771 21.5533 15.3447 21.5533 15.6748V20.9819C21.5522 21.9719 20.7501 22.7742 19.7602 22.7751H2.98862C1.99864 22.7742 1.19662 21.9719 1.19545 20.9819V5.40586C1.19662 4.41611 1.99864 3.61385 2.98862 3.61268H8.29576C8.62591 3.61268 8.89348 3.34511 8.89348 3.01496C8.89348 2.68504 8.62591 2.41724 8.29576 2.41724H2.98862C1.33881 2.4191 0.00186789 3.75605 0 5.40586V20.9822C0.00186789 22.632 1.33881 23.9689 2.98862 23.9708H19.7602C21.41 23.9689 22.7469 22.632 22.7488 20.9822V15.6748C22.7488 15.3447 22.4812 15.0771 22.1511 15.0771Z" fill="#FFF"></path><path d="M22.5121 0.878905C21.4616 -0.171549 19.7586 -0.171549 18.7081 0.878905L8.04433 11.5427C7.97124 11.6158 7.91848 11.7064 7.89093 11.8058L6.48861 16.8685C6.43094 17.0761 6.48954 17.2983 6.64178 17.4508C6.79424 17.603 7.01652 17.6616 7.22409 17.6042L12.2868 16.2017C12.3862 16.1741 12.4768 16.1213 12.5499 16.0483L23.2134 5.38425C24.2623 4.3331 24.2623 2.63145 23.2134 1.5803L22.5121 0.878905ZM9.34671 11.9312L18.0742 3.20349L20.8889 6.01817L12.1612 14.7459L9.34671 11.9312ZM8.78448 13.0594L11.0332 15.3083L7.92268 16.1701L8.78448 13.0594ZM22.3682 4.53903L21.7343 5.17295L18.9194 2.35804L19.5536 1.72412C20.137 1.14064 21.0831 1.14064 21.6666 1.72412L22.3682 2.42552C22.9508 3.0097 22.9508 3.95508 22.3682 4.53903Z" fill="#FFF"></path></g><defs><clipPath id="clip0_346_13990"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                            </button> */}
                        </div>
                    </div>
                    {/* 2 */}
                    <div className={styles.tApiDetectorKey}>
                        <h5>Email</h5>
                        <div className={styles.tApiDetectorKeyeditbtn}>
                            {/* <p>example@gmail.com</p> */}
                            <p>{userDetails ? ` ${userDetails.email}` : 'email not available'}</p>
                            {/* <button>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><g clipPath="url(#clip0_346_13990)"><path d="M22.1511 15.0771C21.8209 15.0771 21.5533 15.3447 21.5533 15.6748V20.9819C21.5522 21.9719 20.7501 22.7742 19.7602 22.7751H2.98862C1.99864 22.7742 1.19662 21.9719 1.19545 20.9819V5.40586C1.19662 4.41611 1.99864 3.61385 2.98862 3.61268H8.29576C8.62591 3.61268 8.89348 3.34511 8.89348 3.01496C8.89348 2.68504 8.62591 2.41724 8.29576 2.41724H2.98862C1.33881 2.4191 0.00186789 3.75605 0 5.40586V20.9822C0.00186789 22.632 1.33881 23.9689 2.98862 23.9708H19.7602C21.41 23.9689 22.7469 22.632 22.7488 20.9822V15.6748C22.7488 15.3447 22.4812 15.0771 22.1511 15.0771Z" fill="#FFF"></path><path d="M22.5121 0.878905C21.4616 -0.171549 19.7586 -0.171549 18.7081 0.878905L8.04433 11.5427C7.97124 11.6158 7.91848 11.7064 7.89093 11.8058L6.48861 16.8685C6.43094 17.0761 6.48954 17.2983 6.64178 17.4508C6.79424 17.603 7.01652 17.6616 7.22409 17.6042L12.2868 16.2017C12.3862 16.1741 12.4768 16.1213 12.5499 16.0483L23.2134 5.38425C24.2623 4.3331 24.2623 2.63145 23.2134 1.5803L22.5121 0.878905ZM9.34671 11.9312L18.0742 3.20349L20.8889 6.01817L12.1612 14.7459L9.34671 11.9312ZM8.78448 13.0594L11.0332 15.3083L7.92268 16.1701L8.78448 13.0594ZM22.3682 4.53903L21.7343 5.17295L18.9194 2.35804L19.5536 1.72412C20.137 1.14064 21.0831 1.14064 21.6666 1.72412L22.3682 2.42552C22.9508 3.0097 22.9508 3.95508 22.3682 4.53903Z" fill="#FFF"></path></g><defs><clipPath id="clip0_346_13990"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
                            </button> */}
                        </div>
                    </div>
                    {/* 3 */}
                    <div className={styles.tApiDetectorKey}>
                        <h5>ZeroGPT API Key</h5>
                        <p>{userDetails ? ` ${userDetails.zeroGptApiKey}` : 'API Key not available'}</p>
                        
                    </div>

                </div>

            </div>
            {/* 2 */}
            <div className={`${styles.turnitApiDetectorBgAccount} ${styles.turnitApiDetectorBgAccountwidth}`}>
                <div className={styles.turnitApiDetectorContent}>
                    <div className={styles.turnitApiDetectorContentbtn}>
                        <h4>Billing</h4>
                        <button onClick={() => { router.push("/dashboard/pricing-plan")  }}>Upgrade</button>
                    </div>
                    <p>Manage your subscription and billing details.</p>
                </div>
                <div className={`${styles.turnitApiDetectorKey} ${styles.turnitApiDetectorKeywidth}`}>
                    {/* 1 */}
                    <div className={styles.tApiDetectorKey}>
                        <h5>Current Plan</h5>
                        <p>{fetchPlan()}</p>
                    </div>


                </div>

            </div>
        </div>

    )
}

export default DashAccount
