import axios from "axios";
import { clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const insertInteractions = async ({
  userId,
  action,
  productId,
  searchQuery,
  filtersUsed,
}) => {
  const interactionObj = {
    userId,
    action,
    productId,
    searchQuery,
    filtersUsed,
  };

  try {
    const response = await axios.post(
      `http://localhost:3000/api/insert-interaction`,
      {
        userId: interactionObj.userId,
        action: interactionObj.action,
        productId: interactionObj.productId,
        searchQuery: interactionObj.searchQuery,
        filtersUsed: interactionObj.filtersUsed,
      }
    );
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
