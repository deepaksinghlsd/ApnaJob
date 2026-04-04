import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
];


const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="relative w-full px-12 max-w-3xl mx-auto my-20 ">
            <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {category.map((cat, index) => (
                        <CarouselItem 
                            key={index} 
                            className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3 flex justify-center items-center"
                        >
                            <div className="w-full flex justify-center">
                                <Button 
                                    onClick={() => searchJobHandler(cat)} 
                                    variant="outline" 
                                    className="w-[200px] h-12 rounded-full text-sm md:text-base
                                             shadow-md hover:shadow-lg transition-all duration-300
                                             border-2 hover:bg-gray-50"
                                >
                                    {cat}
                                </Button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2  ">
        
                    <CarouselPrevious 
                        className="h-10 w-10 bg-white shadow-lg hover:bg-gray-50
                                 border-2 opacity-90 hover:opacity-100"
                    />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                    <CarouselNext 
                        className="h-10 w-10 bg-white shadow-lg hover:bg-gray-50
                                 border-2 opacity-90 hover:opacity-100"
                    />
                </div>
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;