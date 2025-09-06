import { Request, Response } from "express";
import Category from "../models/Category";


export const createCategory = async (req: Request, res: Response) => {

    try {
        const { name, description } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const CategorysDetails = await Category.create({
            name: name,
            description: description,
        });
        

        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
        });
    }
    catch (error) {
        console.log("Error in createCategory", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


export const showAllCategories = async (req:Request, res:Response) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const categories = await Category.find({});
		res.status(200).json({
			success: true,
			categories
		});
	} catch (error) {
        console.log("Error in showAllCategories ", error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};
