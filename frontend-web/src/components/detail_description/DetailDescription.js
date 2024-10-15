import PropTypes from 'prop-types';

const DetailDescription = ({ description }) => {
  return (
    <div className="border-2 border-double border-[#3CA9F9] rounded-lg p-4">
      <h2 className="text-[#3CA9F9] font-extrabold">Thông tin chi tiết :</h2>
      <p>{description}</p>
    </div>
  );
};

DetailDescription.propTypes = {
    description: PropTypes.string,
    };

export default DetailDescription;