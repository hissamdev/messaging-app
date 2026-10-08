export default function RequestBox() {
    return (
        <form className="w-150 h-full border border-gray-700 rounded-3xl flex flex-col items-center">
            Add your friend
            <input
                placeholder="Enter username"
                className="border border-gray-700 rounded-md p-2"
            />
        </form>
    );
}
