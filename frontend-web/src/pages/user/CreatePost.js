import BasicInformationForm from "../../components/form/BasicInformationForm";
import { useEffect } from "react";
const CreatePost = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <BasicInformationForm />
    </div>
  );
};

export default CreatePost;
