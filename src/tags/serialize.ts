import { Tag } from "./Tag";
import { MongooseTag } from "./model";

export interface TagSerialized extends Omit<Tag, "userId"> {}

export function serializeTag(tag: MongooseTag): TagSerialized {
  return {
    id: tag.id as string,
    name: tag.name,
  };
}
