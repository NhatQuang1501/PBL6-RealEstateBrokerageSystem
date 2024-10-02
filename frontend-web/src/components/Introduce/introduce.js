/* eslint-disable jsx-a11y/anchor-is-valid */
import FooterLogo from '../../assets/image/Footer_Logo.png';

function Introduce() {
    return (
        <div className="flex justify-center items-center bg-white">
            <div className="max-w-[70rem] flex justify-between items-center p-6 bg-white mx-10 my-10">
                <div className="max-w-[50rem] font-montserrat">
                    <h2 className="text-2xl font-bold mb-4">Đội ngũ tư vấn</h2>
                    <p className="text-gray-700 mb-6">
                        Hội đồng tham vấn cùng đội ngũ biên tập viên là những người đảm bảo nội dung chúng tôi cung cấp chính xác về các thông tin liên quan đến bất động sản.
                    </p>
                    <a href="#" className="bg-[#3CA9F9] text-white shadow-lg py-2 px-4 rounded-md hover:bg-[#1582d0]">Tư vấn ngay</a>
                </div>
                <div className="w-80">
                    <img className="rounded-lg" src={FooterLogo} alt="Logo tư vấn" />
                </div>
            </div>
        </div>
    );
}

export default Introduce;
