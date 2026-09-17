import Member from "../models/Member.js";

export const createMember = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const existingMember = await Member.findOne({ phone });

        if (existingMember) {
            return res.status(400).json({
                message: "Member already exists"
            });
        }

        const member = await Member.create({
            name,
            phone
        });

        res.status(201).json(member);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getMembers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc",
            search = ""
        } = req.query;

        const skip = (page - 1) * limit;

        const filter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const sort = {
            [sortBy]: order === "asc" ? 1 : -1
        };

        const [members, total] = await Promise.all([
            Member.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(Number(limit)),

            Member.countDocuments(filter)
        ]);

        res.json({
            members,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};