const Tour = require("../models/Tour");

exports.getToursService = async (filters, queries) => {
  const tours = await Tour.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const totalCounts = await Tour.countDocuments(filters);
  const totalPages = Math.ceil(totalCounts / queries.limit);
  const currentPage = queries.page;
  const currentPageItems = tours.length;
  return { totalCounts, currentPageItems, totalPages, currentPage, tours };
};

exports.createTourService = async (data) => {
  const tour = await Tour.create(data);
  return tour;
};

exports.getTourByIdService = async (tourId) => {
  const tour = await Tour.findById(tourId);
  //increase the views every time the user hits this route
  tour.view = tour.view + 1;
  await tour.save();
  return tour;
};

exports.updateTourByIdService = async (tourId, data) => {
  //upd
  const tour = await Tour.updateOne(
    { _id: tourId },
    { $set: data },
    { runValidators: true }
  );
  return tour;
};

exports.getTrendingToursService = async () => {
  //get top 3 most views tours
  const tours = await Tour.find().sort({ view: -1 }).limit(3);
  return tours;
};

exports.getCheapestToursService = async () => {
  //get top 3 cheapest tours
  const tours = await Tour.find().sort({ price: 1 }).limit(3);
  return tours;
};
