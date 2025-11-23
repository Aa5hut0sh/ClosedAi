export const Appbar = () => {
    return (
        <div className="shadow h-14 flex justify-between items-center px-4 bg-white">
            <div className="flex items-center">
                <div className="text-lg font-bold">PayTM App</div>
            </div>
            <div className="flex items-center">
                <div className="mr-4 font-medium">Hello</div>
                <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center">
                    <div className="text-xl font-medium">U</div>
                </div>
            </div>
        </div>
    );
}