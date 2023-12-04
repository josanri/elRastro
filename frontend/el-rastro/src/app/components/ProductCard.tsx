"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { ProductInterface, Rate } from "@/app/product.types"

let apiUrl = ""
if (process.env.NODE_ENV === "development") {
  apiUrl = `http://localhost:8003/api/v1/photo/`
} else {
  apiUrl = `http://backend-micro-image-storage/api/v1/photo/`
}

async function getPhoto(id: string) {
  try {
    const photo_result = await fetch(apiUrl + id)
    const url = await photo_result.json()
    return url
  } catch (error: any) {
    if (error.cause?.code === "ECONNREFUSED") {
      console.error(
        "Error connecting to backend API. Is the backend service working?"
      )
      return "https://picsum.photos/800/400"
    }
    console.error("Error fetching photo:", error.message)
    return "https://picsum.photos/800/400"
  }
}

function ProductCard(props: ProductInterface) {
  const product = props.product

  const formattedCloseDate = new Date(
    props.product.closeDate
  ).toLocaleDateString()
  const closed = new Date(product.closeDate) < new Date()

  const [showPopup, setShowPopup] = useState(false)
  const [productPhoto, setProductPhoto] = useState(
    "https://picsum.photos/800/400"
  )
  const [ownerPhoto, setOwnerPhoto] = useState("https://picsum.photos/800/400")

  const handleHoverEnter = () => {
    setShowPopup(true)
  }

  const handleHoverLeave = () => {
    setShowPopup(false)
  }

  useEffect(() => {
    const fetchPhoto = async () => {
      const url = await getPhoto(product._id)
      setProductPhoto(url)
    }

    const fetchOwnerPhoto = async () => {
      const url = await getPhoto(product.owner._id)
      setOwnerPhoto(url)
    }

    fetchOwnerPhoto()
    fetchPhoto()
    
  }, [product._id, product.owner._id])
  const rating = "0 ⭐ :(";
  return (
    
    <div className="flex flex-col justify-between w-full max-w-lg h-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link href={"/product/" + product._id}>
        <img
          className="mb-3 rounded-t-lg object-cover object-center"
          src={productPhoto}
          alt="product image"
        />
      </Link>
      <div className="px-5 pb-5 flex flex-col justify-between flex-grow">
        <div className="flex flex-row justify-between items-center md:items-start mt-2">
          <Link href={"/product/" + product._id}>
            <h5
              className={`text-3xl sm:text-2xl pr-3 font-semibold tracking-tight text-gray-900 dark:text-white mb-2 ${
                product.title.split(" ")[0].length > 10
                  ? "max-w-full overflow-hidden overflow-ellipsis"
                  : ""
              }`}
            >
              {product.title}
            </h5>
          </Link>
          <Link href="#" className="flex-shrink-0 relative group">
            <div
              className="relative group"
              onMouseEnter={handleHoverEnter}
              onMouseLeave={handleHoverLeave}
            >
              {ownerPhoto && (
                <div className="flex items-center">
                  <img
                    className="inline-block object-cover h-16 w-16 sm:h-10 sm:w-10 rounded-full cursor-pointer transition-transform transform group-hover:scale-110"
                    src={ownerPhoto}
                    alt="user image"
                  />
                </div>
              )}
              {showPopup && (
                <div
                  data-popover
                  id="popover-user-profile"
                  role="tooltip"
                  className="absolute z-10 inline-block w-64 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600 transition-opacity duration-300 opacity-100 left-auto right-0"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <img
                        className="w-10 h-10 object-cover rounded-full"
                        src={ownerPhoto}
                        alt="owner's avatar"
                      />
                      <p className="text-base font-semibold leading-none text-gray-900 dark:text-white">
                        {product.owner.username}
                      </p>
                      <div></div>
                    </div>
                    <div className="flex text-sm">{rating}</div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="mt-2 text-lg sm:text:md text-gray-700 dark:text-gray-400">
            {product.description.length > 30
              ? product.description.substring(0, 30) + "..."
              : product.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="text-3xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {product.bids.length == 0
              ? product.initialPrice
              : product.bids[product.bids.length - 1].amount}
            €
          </div>
          <div className="ml-4 align-middle">
            {closed && !props.activeOwner ? (
              <Link href={`/product/owner/${product.owner.username}`}>
                <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 hover:scale-105 transform transition-all duration-300">
                  More like this
                </button>
              </Link>
            ) : (
              <Link href={`/product/${product._id}`}>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-105 transform transition-all duration-300">
                  Show more
                </button>
              </Link>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          <strong>{closed ? "Closed on" : "Open until"}</strong>:{" "}
          {formattedCloseDate}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
