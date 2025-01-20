import React from "react";

export default function LikersDislikers({ likers, dislikers, onClose }) {
    return (
        <dialog
            id="likers-dislikers-modal"
            className="modal modal-bottom sm:modal-middle"
        >
            <div
                className="modal-box w-[600px] max-w-3xl bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between"
            >
                <h3 className="font-bold text-lg text-white text-center mb-4">
                    Likers & Dislikers
                </h3>
                <div className="flex flex-1">
                    {/* Likers Section */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <h4 className="font-semibold text-white mb-2 text-center">
                            Likers
                        </h4>
                        <ul className="text-gray-300 space-y-1">
                            {likers.length > 0 ? (
                                likers.map((liker, index) => (
                                    <li key={index} className="text-center">
                                        {liker?.gmail?.split("@")[0] || "Unknown User"}
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-center text-gray-500">
                                    No likers for this review.
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] bg-gray-500"></div>

                    {/* Dislikers Section */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <h4 className="font-semibold text-white mb-2 text-center">
                            Dislikers
                        </h4>
                        <ul className="text-gray-300 space-y-1">
                            {dislikers.length > 0 ? (
                                dislikers.map((disliker, index) => (
                                    <li key={index} className="text-center">
                                        {disliker?.gmail?.split("@")[0] || "Unknown User"}
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-center text-gray-500">
                                    No dislikers for this review.
                                </p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Centered Close Button */}
                <div className="modal-action justify-center">
                    <button
                        className="btn bg-gray-600 hover:bg-gray-800 text-white rounded-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
}
