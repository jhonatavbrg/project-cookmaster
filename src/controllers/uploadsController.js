const upload = require('../utils/upload');
const { update } = require('../services/uploadsService');

const uploadImg = [
  upload.single('image'),
  async (request, response, next) => {
    const { id } = request.params;

    try {
      const setImage = await update(id);
      return response.status(setImage.status).json(setImage.message);
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = {
  uploadImg,
};
