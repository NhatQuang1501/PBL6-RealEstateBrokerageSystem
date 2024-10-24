const error = () => {
    return (
        <div className="bg-white dark:bg-gray-900 h-[85vh] flex flex-col justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">OPPS !404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Đã xảy ra lỗi</p>
                    <p className="mb-4 text-lg font-semibold text-gray-500 dark:text-gray-400">Hình như bạn đang gặp vẫn đề gì đó về đường dẫn</p>
                    <a href="/" className="inline-flex underline text-blue-500 bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Quay về trang chính</a>
                </div>
            </div>
        </div>
    )
}

export default error