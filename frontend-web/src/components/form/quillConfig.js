import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const quillConfig = {
  modules: {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['blockquote', 'code-block'],
      ['image'],
    ],
  },
  formats: [
    'header', 'font', 'list', 'align', 'bold', 'italic', 'underline', 'strike', 
    'color', 'background', 'link', 'blockquote', 'code-block', 'image'
  ]
};

export default quillConfig;