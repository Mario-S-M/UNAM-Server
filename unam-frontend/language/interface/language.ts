export interface Language {
    data: Data;
}

export interface Data {
    lenguages: Lenguage[];
}

export interface Lenguage {
    id:        string;
    name:      string;
    icons:      string[];
    isActive:  boolean;
}
