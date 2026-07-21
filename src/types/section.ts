export interface Section {
    id: number
    name: string
    channel_id: number
}

export interface SectionResponse {
    sections: Section[]
    total: number
}