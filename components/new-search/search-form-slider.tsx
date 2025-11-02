"use client"
import { useRouter } from "@/i18n/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { CitySelect } from "./city-selection-input";
import { useBookingStore } from "@/store/use-reverstation-store";

interface HotelSearchFormProps {
    initialValues?: {
        city?: string
        from_date?: string
        to_date?: string
        num_adults?: string
        num_children?: string
    },
    hideHeading?: boolean
}

const parseDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined

    const parts = dateString.split("/")
    if (parts.length !== 3) return undefined

    const [day, month, year] = parts
    const date = new Date(Number(year), Number(month) - 1, Number(day))

    // Validate the date is valid
    if (isNaN(date.getTime())) return undefined

    return date
}

const SearchFormSlider = ({ initialValues, hideHeading = false }: HotelSearchFormProps) => {
    const tMain = useTranslations();
    const router = useRouter();
    const [city, setCity] = useState(initialValues?.city || "");
    const [fromDate, setFromDate] = useState<Date | undefined>(() => {
        return initialValues?.from_date ? parseDateFromString(initialValues?.from_date) : undefined
    });
    const [toDate, setToDate] = useState<Date | undefined>(() => {
        return initialValues?.to_date ? parseDateFromString(initialValues?.to_date) : undefined
    }
    )
    const [numAdults, setNumAdults] = useState(initialValues?.num_adults || "");
    const [numChildren, setNumChildren] = useState(initialValues?.num_children || "");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { setFromDate: setFromDateStore, setToDate: setToDateStore, setGuests } = useBookingStore();

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!city.trim()) {
            newErrors.city = "City is required"
        }
        if (!fromDate) {
            newErrors.from_date = "Check-in date is required"
        }
        if (!toDate) {
            newErrors.to_date = "Check-out date is required"
        }
        if (!numAdults || Number.parseInt(numAdults) < 1) {
            newErrors.num_adults = "At least 1 adult is required"
        }
        if (!numChildren || Number.parseInt(numChildren) < 0) {
            newErrors.num_children = "Number of children is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const buildSearchParams = () => {
        const fromDateFormatted = format(fromDate!, "dd/MM/yyyy")
        const toDateFormatted = format(toDate!, "dd/MM/yyyy")

        return new URLSearchParams({
            city: city.trim(),
            from_date: fromDateFormatted,
            to_date: toDateFormatted,
            num_adults: numAdults,
            num_children: numChildren,
        })
    }

    const setReservaitionCriteria = () => {
        setFromDateStore(format(fromDate!, "dd/MM/yyyy"));
        setToDateStore(format(toDate!, "dd/MM/yyyy"));
        setGuests(Number.parseInt(numAdults), Number.parseInt(numChildren));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setReservaitionCriteria();
        const params = buildSearchParams();
        router.push(`/hotels?${params.toString()}`)
    }


    return (
        <div className="px-6 lg:px-0">
            {
                !hideHeading && (
                    <div className="text-white text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            {tMain("HomePage.hero.title1")}
                        </h1>
                        <p className="text-xl md:text-xl mb-8">
                            {tMain("HomePage.hero.title2")}
                        </p>
                    </div>
                )
            }
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl max-w-6xl mx-auto space-y-6">
                {/* city input */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <CitySelect value={city} onChange={setCity} error={errors.city} />
                    {/* Check-in Date */}
                    <div className="space-y-2">
                        <Label>
                            Check-in Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!fromDate ? "text-muted-foreground" : ""
                                        } ${errors.from_date ? "border-red-500" : ""}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fromDate ? format(fromDate, "dd/MM/yyyy") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={fromDate}
                                    onSelect={setFromDate}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.from_date && <p className="text-sm text-red-500">{errors.from_date}</p>}
                    </div>
                    {/* Check-out Date */}
                    <div className="space-y-2">
                        <Label>
                            Check-out Date <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!toDate ? "text-muted-foreground" : ""
                                        } ${errors.to_date ? "border-red-500" : ""}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {toDate ? format(toDate, "dd/MM/yyyy") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={toDate}
                                    onSelect={setToDate}
                                    disabled={(date) => date <= (fromDate || new Date())}
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.to_date && <p className="text-sm text-red-500">{errors.to_date}</p>}
                    </div>
                    {/* Adults and Children */}
                    <div className="space-y-2">
                        <Label htmlFor="adults">
                            Adults
                        </Label>
                        <Input
                            id="adults"
                            type="number"
                            min="1"
                            placeholder="Number of adults"
                            value={numAdults}
                            onChange={(e) => setNumAdults(e.target.value)}
                            className={errors.num_adults ? "border-red-500" : ""}
                        />
                        {errors.num_adults && <p className="text-sm text-red-500">{errors.num_adults}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="children">
                            Children
                        </Label>
                        <Input
                            id="children"
                            type="number"
                            min="0"
                            placeholder="Number of children"
                            value={numChildren}
                            onChange={(e) => setNumChildren(e.target.value)}
                            className={errors.num_children ? "border-red-500" : ""}
                        />
                        {errors.num_children && <p className="text-sm text-red-500">{errors.num_children}</p>}
                    </div>
                </div>
                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                    Search Hotels
                </Button>
            </form>
        </div>
    )
};

export default SearchFormSlider;