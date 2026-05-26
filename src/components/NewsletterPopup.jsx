import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaEnvelopeOpenText, FaTimes, FaExternalLinkAlt } from "react-icons/fa";
import { supabase } from "../services/supabase-client";

const NewsletterPopup = ({ scrolled }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [newsletters, setNewsletters] = useState([]);
	const [availableYears, setAvailableYears] = useState([]);
	const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [previewOpen, setPreviewOpen] = useState(false);

	const btnRef = useRef(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const fetchNewsletters = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const { data, error: fetchError } = await supabase
					.schema("me_dataspace")
					.from("newsletters")
					.select("*")
					.order("published_at", { ascending: false });

				if (fetchError) throw fetchError;
				setNewsletters(data || []);
			} catch (err) {
				setError("Unable to load newsletters right now.");
				setNewsletters([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchNewsletters();
	}, []);

	useEffect(() => {
		if (!newsletters.length) return;

		const sortedYears = [...new Set(newsletters.map((item) => String(item.publish_yr)))].sort(
			(a, b) => Number(b) - Number(a)
		);
		setAvailableYears(sortedYears);

		const latest = newsletters[0];
		if (latest?.publish_month && latest?.publish_yr) {
			setSelectedMonth(String(latest.publish_month));
			setSelectedYear(String(latest.publish_yr));
		}
	}, [newsletters]);

	useEffect(() => {
		if (!isOpen) return;

		const handleOutsideClick = (event) => {
			if (
				dropdownRef.current && !dropdownRef.current.contains(event.target) &&
				btnRef.current && !btnRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") {
				setIsOpen(false);
				setPreviewOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		window.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	const getDropdownStyle = () => {
		if (!btnRef.current) return {};
		const rect = btnRef.current.getBoundingClientRect();

		return {
			position: "fixed",
			top: rect.bottom + 8,
			right: window.innerWidth - rect.right,
		};
	};

	const latestNewsletter = newsletters[0];
	const previousNewsletters = newsletters.slice(1, 5);
	const selectedNewsletter = newsletters.find(
		(newsletter) => String(newsletter.publish_month) === String(selectedMonth) && String(newsletter.publish_yr) === String(selectedYear)
	);
	const monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	const formatLabel = (newsletter) => {
		if (!newsletter?.publish_month || !newsletter?.publish_yr) return "Latest issue";
		return `${monthNames[newsletter.publish_month - 1]} ${newsletter.publish_yr}`;
	};

	const iconClass = scrolled
		? "bg-[#ff7612] text-white hover:bg-[#461711] shadow-[#ff7612]/20"
		: "bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#ff7612] border border-white/20";

	return (
		<>
			<button
				ref={btnRef}
				onClick={() => setIsOpen((value) => !value)}
				aria-label="Newsletter updates"
				className={`relative p-2.5 rounded-xl transition-all duration-500 group shadow-lg flex items-center justify-center ${iconClass} ${isOpen ? "ring-4 ring-[#ff7612]/30 scale-95" : "hover:-translate-y-1 hover:scale-110"}`}
			>
				<FaEnvelopeOpenText className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-500 group-hover:rotate-12" />
				<span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffdb5b] opacity-75"></span>
					<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffdb5b] border-2 border-white shadow-sm"></span>
				</span>
			</button>

			{isOpen && createPortal(
				<div
					ref={dropdownRef}
					style={getDropdownStyle()}
					className="w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
				>
					<div className="bg-gradient-to-r from-[#461711] to-[#7a3012] px-5 py-4 flex items-center justify-between">
						<div>
							<p className="text-white font-bold text-sm tracking-wide">Newsletter</p>
							<p className="text-white/60 text-xs mt-0.5">Latest newsletter issues and previews</p>
						</div>
						<button onClick={() => setIsOpen(false)} className="text-white/60 transition-colors p-1" aria-label="Close newsletter popup">
							<FaTimes className="w-5 h-5" />
						</button>
					</div>

					<div className="p-5">
						<div className="flex gap-3 mb-4">
							<div className="flex-1">
								<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Month</label>
								<select
									value={selectedMonth}
									onChange={(event) => setSelectedMonth(event.target.value)}
									className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
								>
									{Array.from({ length: 12 }, (_, index) => (
										<option key={index} value={index + 1}>{monthNames[index]}</option>
									))}
								</select>
							</div>
							<div className="flex-1">
								<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Year</label>
								<select
									value={selectedYear}
									onChange={(event) => setSelectedYear(event.target.value)}
									className="w-full px-3 py-2 border-2 border-[#461711] rounded-lg text-sm font-medium text-[#461711] bg-white focus:ring-2 focus:ring-[#ff7612] focus:border-transparent outline-none transition-all"
									disabled={availableYears.length === 0}
								>
									{availableYears.length === 0 ? (
										<option disabled>No years available</option>
									) : (
										availableYears.map((year) => (
											<option key={year} value={year}>{year}</option>
										))
									)}
								</select>
							</div>
						</div>

						{isLoading ? (
							<div className="flex items-center justify-center py-6 gap-3">
								<svg className="animate-spin h-6 w-6 text-[#ff7612]" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
								<span className="text-sm text-gray-500 font-medium">Loading newsletters...</span>
							</div>
						) : error ? (
							<div className="text-center py-6">
								<p className="text-sm text-red-500 font-medium">{error}</p>
							</div>
						) : selectedNewsletter ? (
							<>
								<button
									onClick={() => { setPreviewOpen(true); setIsOpen(false); }}
									className="w-full relative overflow-hidden rounded-xl border-2 border-gray-100 transition-all duration-300 shadow-md"
								>
									<img
										src={selectedNewsletter.newsletter_url}
										alt={formatLabel(selectedNewsletter)}
										className="w-full h-56 object-cover object-top transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
										<span className="text-white text-xs font-bold flex items-center gap-1.5">
											<FaExternalLinkAlt className="w-3.5 h-3.5" />
											Click to view full issue
										</span>
									</div>
								</button>

								<div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
									<p className="text-sm font-semibold text-[#461711]">{formatLabel(selectedNewsletter)}</p>
									<p className="text-xs text-gray-500 mt-1">Selected newsletter issue</p>
								</div>

							</>
						) : (
							<div className="text-center py-6">
								<p className="text-sm font-semibold text-gray-500">No newsletter found for the selected month and year.</p>
							</div>
						)}
					</div>
				</div>,
				document.body
			)}

			{previewOpen && selectedNewsletter && createPortal(
				<div
					className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
					onClick={() => setPreviewOpen(false)}
				>
					<div
						className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
						style={{ maxHeight: "92vh" }}
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#461711] to-[#7a3012] flex-shrink-0">
							<div>
								<p className="text-white font-bold">{formatLabel(selectedNewsletter)}</p>
								<p className="text-white/60 text-xs">Newsletter preview</p>
							</div>
							<button
								onClick={() => setPreviewOpen(false)}
								className="p-2 text-white/60 rounded-full transition-colors"
								aria-label="Close newsletter preview"
							>
								<FaTimes className="w-6 h-6" />
							</button>
						</div>
						<div className="overflow-y-auto flex-1 bg-gray-50">
							<img
								src={selectedNewsletter.newsletter_url}
								alt={formatLabel(selectedNewsletter)}
								className="w-full h-auto block"
							/>
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
	);
};

export default NewsletterPopup;