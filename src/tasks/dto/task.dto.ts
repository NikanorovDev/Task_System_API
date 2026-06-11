import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}