import GuideItems from "../../../helpers/guideItems";

export default async function handler(req, res) {
  const guideItems = GuideItems({}, req.headers);
  const { uri } = req.query;
  const one = await guideItems.getOne(uri);
  const all = await guideItems.getAll();

  res.status(200).json({ one, all });
}
