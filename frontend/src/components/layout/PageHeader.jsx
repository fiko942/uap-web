import React from 'react';
import { Separator } from "@/components/ui/separator";

const PageHeader = ({ title, subtitle, actions }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
                    {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
            {/* <Separator className="my-6" /> */}
        </div>
    );
};

export default PageHeader;
