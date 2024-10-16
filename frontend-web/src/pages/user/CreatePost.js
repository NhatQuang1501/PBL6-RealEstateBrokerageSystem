import BasicInformationForm from "../../components/form/BasicInformationForm";

const CreatePost = () => {
    return (
        <form className="flex flex-col items-center justify-center">
        <BasicInformationForm />
        <button className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4">
            Đăng bài
        </button>
        </form>
    );
}

export default CreatePost;